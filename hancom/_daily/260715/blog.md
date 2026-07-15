# 오늘 학습한 내용

## Vercel 배포 트러블슈팅 — Express + 정적 파일 혼합 프로젝트

Express 서버와 정적 파일(HTML/CSS/JS)을 함께 Vercel에 배포하면서 겪은 오류와 해결 과정을 정리한다.

---

### 프로젝트 구조

```
07_groq/
├── index.html   # 프론트엔드
├── style.css
├── app.js       # 프론트엔드 JS
├── index.js     # Groq API 단일 호출 테스트용 스크립트 (잔여 파일)
├── server.js    # Express 서버 (POST /api/chat)
└── vercel.json
```

로컬에서는 `server.js`를 직접 실행해 `localhost:3000`으로 접근했다.
이걸 `vercel --prod`로 배포하면서 오류가 연달아 발생했다.

---

### 오류 1 — `Cannot GET /` (Express 오류)

#### 증상

배포된 URL에 접속하면 Express의 기본 404 메시지가 뜬다.

```
Cannot GET /
```

#### 원인

두 가지가 복합적으로 작용했다.

**① `GET /` 라우트 없음**

`server.js`에는 `POST /api/chat`만 있었다. Express는 `GET /`를 모르니 기본 404를 반환했다.

**② `app.js`의 fetch URL 하드코딩**

```js
// 문제: 배포 환경에 localhost:3000은 없음
fetch("http://localhost:3000/api/chat", { ... })
```

#### 수정한 것

`app.js`의 fetch URL을 상대경로로 변경했다. 이게 오류 1에서 유일하게 실질적인 수정이다.

```js
fetch("/api/chat", { ... })
```

`server.js`에 `express.static(".")`도 추가했지만, 이건 **Vercel에서 동작하지 않는다.** Vercel serverless 환경에서는 함수 번들에 정적 파일이 포함되지 않기 때문에 `express.static`이 파일을 찾지 못한다. 로컬 개발용으로는 남겨뒀지만 Vercel 문제 해결에는 기여하지 않았다.

`vercel.json`도 처음 만들었다.

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

---

### 오류 2 — 여전히 `Cannot GET /`

#### 원인

`routes`가 모든 요청을 `server.js`로 보내고 있었고, `express.static`은 Vercel serverless에서 파일을 서빙하지 못했다.

또한 Vercel serverless에서 Express 앱을 함수로 인식시키려면 `export default app`이 필요하다. Vercel은 `app.listen()`으로 포트를 여는 방식이 아니라 앱을 export해서 요청을 전달받는 방식으로 동작한다.

```js
// server.js 맨 아래에 추가
export default app;

// app.listen()은 로컬 개발용으로 그대로 둬도 됨 — Vercel에서는 무시됨
```

---

### 오류 3 — `404: NOT_FOUND` (Vercel 오류)

#### 증상

Express의 "Cannot GET /"가 아닌 Vercel 자체의 404 페이지가 뜬다.

```
404: NOT_FOUND
Code: `NOT_FOUND`
```

오류 메시지가 Express 형식인지 Vercel 형식인지 보면 문제가 어디서 발생했는지 범위를 좁힐 수 있다.

#### 원인

`builds`에 `server.js`만 있으면 그 파일만 배포된다. `index.html` 등 정적 파일은 배포에 포함되지 않아서 Vercel이 찾지 못했다.

**`builds`에 없는 파일은 배포되지 않는다.**

#### 해결 — 최종 `vercel.json`

정적 파일을 `builds`에 명시적으로 추가하고, `routes`로 API와 정적 파일을 분리했다.

```json
{
  "version": 2,
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

| 프로퍼티 | 역할 |
|---|---|
| `builds` | 각 파일을 어떤 형태로 Vercel에 올릴지 지정 |
| `routes` | URL과 배포된 파일을 연결하는 지도 |

`@vercel/node` — JS 파일을 serverless function으로 실행  
`@vercel/static` — 파일을 CDN에 그대로 올림

---

### 환경 변수

로컬의 `.env` 파일은 Vercel이 읽지 않는다.  
Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 직접 추가해야 한다.

---

### 지금 시점에서 더 나은 방법

이번에 사용한 `builds`/`routes` 방식의 `vercel.json`은 레거시 설정이다. 현재 Vercel이 권장하는 방식은 더 단순하다.

- 정적 파일(`index.html`, `style.css`, `app.js`)을 `public/` 폴더 안에 둔다
- Vercel이 `public/`을 자동으로 CDN 서빙한다
- API는 `api/` 폴더 규칙을 따르거나 Express 앱 전체를 하나의 function으로 번들링한다
- `vercel.json` 설정이 거의 필요 없다

이번 트러블슈팅은 이 구조를 모르는 상태에서 로컬 Express 방식을 그대로 올리려다 발생한 문제였다.

---

### 핵심 교훈

1. **로컬과 배포 환경은 다르다** — `localhost` 하드코딩, `express.static`의 파일 접근 방식이 달라진다.
2. **`express.static`은 Vercel serverless에서 동작하지 않는다** — serverless function 번들에 정적 파일이 포함되지 않기 때문이다.
3. **`builds`에 명시된 파일만 배포된다** — 정적 파일도 빠짐없이 추가해야 한다.
4. **오류 메시지 출처를 구분하면 범위가 좁혀진다** — "Cannot GET /"는 Express, "404: NOT_FOUND"는 Vercel.
5. **Express를 Vercel serverless로 쓰려면 `export default app`이 필요하다** — `app.listen()`은 로컬 전용이다.
