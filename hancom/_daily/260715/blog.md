# 오늘 학습한 내용

## Vercel 배포 트러블슈팅 — Express + 정적 파일 혼합 프로젝트

Express 서버와 정적 파일(HTML/CSS/JS)을 함께 Vercel에 배포하면서 겪은 오류와 해결 과정을 정리한다. 중간에 "권장 방식"으로 리팩토링을 시도한 과정까지 포함한다.

---

### 초기 프로젝트 구조

```
07_groq/
├── index.html      # 프론트엔드
├── style.css
├── app.js          # 프론트엔드 JS
├── index.js        # Groq API 단일 호출 테스트 스크립트 (잔여 파일)
└── server.js       # Express 서버 (POST /api/chat)
```

로컬에서는 `server.js`를 직접 실행해 `localhost:3000`으로 접근했다.
이걸 `vercel --prod`로 배포하면서 오류가 연달아 발생했다.

---

### 오류 1 — `Cannot GET /` (Express 오류)

#### 증상

```
Cannot GET /
```

#### 원인

**① `GET /` 라우트 없음** — `server.js`에는 `POST /api/chat`만 있었다.

**② `app.js`의 fetch URL 하드코딩**

```js
fetch("http://localhost:3000/api/chat", { ... })  // 배포 환경엔 localhost:3000이 없음
```

#### 수정

`app.js`의 URL을 상대경로로 변경했다. 오류 1에서 유일하게 실질적인 수정이다.

```js
fetch("/api/chat", { ... })
```

`server.js`에 `express.static(".")`도 추가했지만, 이건 **Vercel에서 동작하지 않는다.** Vercel serverless 환경에서는 함수 번들에 정적 파일이 포함되지 않기 때문에 `express.static`이 파일을 찾지 못한다. 로컬 개발용으로는 남겨뒀지만 Vercel 문제 해결에는 기여하지 않았다.

첫 `vercel.json`도 만들었다.

```json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

---

### 오류 2 — 여전히 `Cannot GET /`

#### 원인

`routes`가 모든 요청을 `server.js`로 보내고 있었고, `express.static`은 Vercel serverless에서 동작하지 않아 결과가 같았다.

또한 Vercel serverless에서 Express 앱을 함수로 인식시키려면 `export default app`이 필요하다. Vercel은 `app.listen()`으로 포트를 여는 방식이 아니라 앱을 export해서 요청을 전달받는 방식으로 동작한다.

```js
export default app;  // server.js 맨 아래 추가
// app.listen()은 로컬 개발용으로 그대로 둬도 됨 — Vercel에서는 무시됨
```

---

### 오류 3 — `404: NOT_FOUND` (Vercel 오류)

#### 증상

Express의 "Cannot GET /"가 아닌 Vercel 자체의 404 페이지.

```
404: NOT_FOUND
Code: `NOT_FOUND`
```

오류 메시지가 Express 형식인지 Vercel 형식인지 보면 문제 발생 위치를 좁힐 수 있다.

#### 원인

`routes`를 수정해서 `/`가 `server.js`로 가지 않고 `index.html`을 찾게 했다. 그런데 `builds`에 `server.js`만 있으면 그 파일만 배포된다. **`builds`에 없는 파일은 배포에 포함되지 않는다.**

#### 1차 해결 — 파일 개별 나열

정적 파일을 `builds`에 하나씩 추가했다.

```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "index.html", "use": "@vercel/static" },
    { "src": "style.css", "use": "@vercel/static" },
    { "src": "app.js", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/chat", "dest": "server.js" },
    { "src": "/", "dest": "/index.html" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

동작은 했지만 파일을 추가할 때마다 `vercel.json`도 같이 수정해야 하는 단점이 있었다.

---

### 환경 변수

로컬의 `.env` 파일은 Vercel이 읽지 않는다.
Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 직접 추가해야 한다.

---

### 리팩토링 — `public/` 폴더 방식으로 개선

#### 구조 변경

정적 파일을 `public/` 폴더로 이동하고, 잔여 파일인 `index.js`를 삭제했다.

```
07_groq/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
└── vercel.json
```

`package.json`의 `"main"` 필드도 `index.js` → `server.js`로 수정했다.

```json
"main": "server.js"
```

`server.js`의 `express.static` 경로도 맞게 수정했다.

```js
app.use(express.static("public"));  // "." → "public"
```

#### zero-config 시도 — 실패 (원인 확인)

`vercel.json`을 완전히 삭제하고, 대시보드 캐시 가능성을 배제하기 위해 새 Vercel 프로젝트(groq-v2)로 처음부터 재배포했다. 결과는 동일하게 `Cannot GET /`.

"Cannot GET /"는 Express 오류다. 즉 Vercel zero-config가 `server.js`를 진입점으로 자동 감지하는 것은 성공했다. 그러나 두 가지가 여전히 동작하지 않았다.

- `express.static("public")` — serverless 함수 번들에 `public/` 폴더가 포함되지 않아 파일을 찾지 못함
- `public/` CDN 자동 서빙 — `vercel.json` 없이는 Vercel이 `public/`을 CDN으로 서빙하지 않음

Vercel 공식 문서가 "public/ 폴더를 자동으로 CDN 서빙한다"고 명시하지만, 실제 테스트에서는 동작하지 않았다. **`vercel.json`에서 `public/**`을 `@vercel/static`으로 명시하는 것이 실제로 필요하다.**

#### 최종 `vercel.json` — `public/**` 와일드카드

파일을 하나씩 나열하는 대신 `public/**`로 한 번에 처리했다.

```json
{
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "public/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/chat", "dest": "server.js" },
    { "src": "/", "dest": "/public/index.html" },
    { "src": "/(.*)", "dest": "/public/$1" }
  ]
}
```

이전과 달리 `public/`에 파일을 추가해도 `vercel.json`을 수정할 필요가 없다.

---

### `vercel.json` 구조 정리

| 프로퍼티 | 역할 |
|---|---|
| `builds` | 각 파일을 어떤 형태로 Vercel에 올릴지 지정 |
| `routes` | URL과 배포된 파일을 연결하는 지도 |

`@vercel/node` — JS 파일을 serverless function으로 실행
`@vercel/static` — 파일을 CDN에 그대로 올림

---

### 핵심 교훈

1. **로컬과 배포 환경은 다르다** — `localhost` 하드코딩, `express.static`의 파일 접근 방식이 달라진다.
2. **`express.static`은 Vercel serverless에서 동작하지 않는다** — serverless function 번들에 정적 파일이 포함되지 않기 때문이다.
3. **`builds`에 명시된 파일만 배포된다** — 정적 파일도 빠짐없이 포함해야 한다.
4. **오류 메시지 출처를 구분하면 범위가 좁혀진다** — "Cannot GET /"는 Express, "404: NOT_FOUND"는 Vercel.
5. **Express를 Vercel serverless로 쓰려면 `export default app`이 필요하다** — `app.listen()`은 로컬 전용이다.
6. **Vercel zero-config는 진입점 감지까지만 한다** — `server.js`는 자동 감지되지만, `public/` CDN 서빙은 자동으로 이뤄지지 않는다. 새 프로젝트로 재테스트해서 직접 확인했다. (2026-07 기준. zero-config Express는 비교적 최근 기능이라 이후 동작이 바뀔 수 있다.)
7. **AI가 제안한 방식도 직접 테스트하기 전까지는 신뢰할 수 없다** — Claude Web, Gemini가 `functions`/`rewrites` 방식을 권장했지만 실제로는 동작하지 않았다. 직접 삽질해서 확인한 `builds` + `routes`가 유일하게 동작한 방식이었다.
