# 오늘 학습한 내용

## Vercel 배포 트러블슈팅 — Express + 정적 파일 혼합 프로젝트

Express 서버와 정적 파일(HTML/CSS/JS)을 함께 Vercel에 배포하면서 겪은 오류와 해결 과정을 정리한다.  
중간에 "권장 방식"으로 리팩토링을 시도한 과정까지 포함한다.

---

### 📁 초기 프로젝트 구조

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

### ❌ 오류 1 — `Cannot GET /` (Express 오류)

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

`app.js`의 URL을 상대경로로 변경했다.  
오류 1에서 유일하게 실질적인 수정이다.

```js
fetch("/api/chat", { ... })
```

`server.js`에 `express.static(".")`도 추가했지만, 이건 **Vercel에서 동작하지 않는다.**  
Vercel serverless 환경에서는 함수 번들에 정적 파일이 포함되지 않기 때문에 `express.static`이 파일을 찾지 못한다.  
로컬 개발용으로는 남겨뒀지만 Vercel 문제 해결에는 기여하지 않았다.

첫 `vercel.json`도 만들었다.

```json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

---

### ❌ 오류 2 — 여전히 `Cannot GET /`

#### 원인

`vercel.json`의 `routes`가 모든 요청을 `server.js`로 보내고 있었고,  
`express.static`은 Vercel serverless에서 동작하지 않아 결과가 같았다.

또한 Vercel serverless에서 Express 앱을 함수로 인식시키려면 `export default app`이 필요하다.  
Vercel은 `app.listen()`으로 포트를 여는 방식이 아니라, 앱을 export해서 요청을 전달받는 방식으로 동작한다.

```js
export default app;  // server.js 맨 아래 추가
// app.listen()은 로컬 개발용으로 그대로 둬도 됨 — Vercel에서는 무시됨
```

---

### ❌ 오류 3 — `404: NOT_FOUND` (Vercel 오류)

#### 증상

Express의 "Cannot GET /"가 아닌 Vercel 자체의 404 페이지.

```
404: NOT_FOUND
Code: `NOT_FOUND`
```

오류 메시지가 Express 형식인지 Vercel 형식인지 보면 문제 발생 위치를 좁힐 수 있다.

#### 원인

`vercel.json`의 `routes`를 수정해서 `/`가 `server.js`로 가지 않고 `index.html`을 찾게 했다.  
그런데 `vercel.json`의 `builds`에 `server.js`만 있으면 그 파일만 배포된다.  
**`builds`에 없는 파일은 배포에 포함되지 않는다.**

#### 1차 해결 — 파일 개별 나열

정적 파일을 `vercel.json`의 `builds`에 하나씩 추가했다.

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

### 🔑 환경 변수

로컬의 `.env` 파일은 Vercel이 읽지 않는다.  
Vercel 대시보드 → 프로젝트 → Settings → Environment Variables에서 직접 추가해야 한다.

---

### 🔁 리팩토링 — `public/` 폴더 방식으로 개선

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

#### ❌ zero-config 시도 — 실패 (원인 확인)

`vercel.json`을 완전히 삭제하고, 대시보드 캐시 가능성을 배제하기 위해 새 Vercel 프로젝트(groq-v2)로 처음부터 재배포했다.  
결과는 동일하게 `Cannot GET /`.

`"Cannot GET /"`는 Express 오류다.  
즉 Vercel zero-config가 `server.js`를 진입점으로 자동 감지하는 것은 성공했다.  
그러나 두 가지가 여전히 동작하지 않았다.

- `express.static("public")` — serverless 함수 번들에 `public/` 폴더가 포함되지 않아 파일을 찾지 못함
- `public/` CDN 자동 서빙 — `vercel.json` 없이는 Vercel이 `public/`을 CDN으로 서빙하지 않음

Vercel 공식 문서가 "`public/` 폴더를 자동으로 CDN 서빙한다"고 명시하지만, 실제 테스트에서는 동작하지 않았다.  
(이 시점의 잠정 결론 — 이후 `api/` 컨벤션 전환 후 원인이 밝혀짐)

#### 🔍 `vc init express` 탐색 — zero-config 구조 확인

"왜 zero-config가 안 될까?"를 파악하기 위해 Vercel 공식 Express 템플릿 구조를 확인했다.

```bash
# 07_groq 안에 새 폴더를 만들어 실행
vc init express groq-v3
```

생성된 구조:

```
groq-v3/
├── api/
│   └── index.js      # export default app — app.listen() 없음
└── package.json
```

핵심은 `public/`이 없다는 것이다.  
Vercel의 zero-config Express 템플릿은 **정적 파일이 없는 순수 API 서버**를 기준으로 만들어져 있다.  
정적 파일과 API가 공존하는 구조는 공식 템플릿이 아예 다루지 않는다.

#### ❌ `functions`/`rewrites` 시도 — 실패

zero-config가 안 되자 Claude Web과 Gemini에게 피드백을 구했다.  
둘 다 `vercel.json`의 `builds`/`routes`(레거시 방식)를 버리고 최신 방식인 `functions`/`rewrites`를 쓰라고 권장했다.

**시도 1** — Claude Web 제안

```json
{
  "functions": {
    "server.js": { "runtime": "@vercel/node@3" }
  },
  "rewrites": [
    { "source": "/api/chat", "destination": "/server.js" }
  ]
}
```

오류:

```
Error: Function Runtimes must have a valid version
```

**시도 2** — Gemini 수정 제안 (runtime 제거, api/ 경로 사용)

```json
{
  "functions": {
    "api/chat.js": {}
  },
  "rewrites": [
    { "source": "/api/chat", "destination": "/api/chat.js" }
  ]
}
```

오류:

```
Error: Function must contain at least one property
```

두 번 모두 실패했다.  
`vercel.json`의 `builds`/`routes` 방식으로 되돌렸다.  
AI가 "더 나은 방식"으로 권장한 것이 실제로는 동작하지 않았다.

#### ✅ 최종 `vercel.json` — `public/**` 와일드카드

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

### 📋 `vercel.json` 구조 정리

| 프로퍼티 | 역할 |
|---|---|
| `builds` | 각 파일을 어떤 형태로 Vercel에 올릴지 지정 |
| `routes` | URL과 배포된 파일을 연결하는 지도 |

`@vercel/node` — JS 파일을 serverless function으로 실행
`@vercel/static` — 파일을 CDN에 그대로 올림

---

### ✅ 추가 리팩토링 — `api/` 컨벤션으로 전환

#### 배경

`vercel.json` + Express 방식이 동작하긴 했지만, 이는 Vercel의 레거시 `builds`/`routes` 방식이다.  
Vercel의 공식 권장 방식은 `api/` 디렉토리를 사용하는 zero-config 서버리스 함수 컨벤션이다.  
오늘 zero-config 테스트가 실패한 원인이 `server.js` 구조 때문인지 확인하기 위해 전환을 시도했다.

이 시점에 `07_groq`를 hancom 모노레포에서 분리해 **`groq-chatbot`이라는 독립 GitHub 레포**로 새로 만들었다.  
이후 내용은 이 레포 기준이다.

#### 구조 변경

`server.js`(Express)를 `api/chat.js`(순수 서버리스 함수)로 교체하고, `vercel.json`을 완전히 삭제했다.

```
groq-chatbot/
├── api/
│   └── chat.js       ← Express 없음, 함수 하나
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── package.json       ← 의존성 없음
└── .gitignore
```

`api/chat.js`는 Express 없이 Vercel이 주입하는 `req`/`res`를 직접 받는다.

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 허용됩니다' });
  }
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.json({ reply: `(mock) ${req.body.prompt}` });

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: req.body.prompt }],
    }),
  });
  const data = await groqRes.json();
  res.json({ reply: data.choices?.[0]?.message?.content || '(응답 없음)' });
}
```

#### ✅ 결과

`vercel.json` 없이 배포했더니 `public/`이 자동으로 서빙됐고, `/api/chat`도 정상 동작했다.  
오전의 zero-config 실패 원인은 `server.js`(Express) 구조 자체에 있었다.  
Vercel은 `api/` 디렉토리를 감지해야 프로젝트를 올바르게 인식하고 `public/`을 함께 서빙한다.

#### `server.js` vs `api/chat.js` 비교

| | `server.js` (Express) | `api/chat.js` (서버리스) |
|---|---|---|
| 실행 방식 | 항상 켜진 서버 | 요청이 올 때만 실행 |
| Vercel 인식 | `vercel.json` 필수 | `api/` 폴더만 있으면 자동 감지 |
| 의존성 | express, cors, dotenv | 없음 (Node 내장 fetch) |
| `public/` 자동 서빙 | 안 됨 | 됨 |

---

### 💡 핵심 교훈

1. **로컬과 배포 환경은 다르다**  
   `localhost` 하드코딩, `express.static`의 파일 접근 방식이 달라진다.

2. **`express.static`은 Vercel serverless에서 동작하지 않는다**  
   serverless function 번들에 정적 파일이 포함되지 않기 때문이다.

3. **`vercel.json`의 `builds`에 명시된 파일만 배포된다**  
   `@vercel/node`(서버), `@vercel/static`(정적 파일) 모두 빠짐없이 등록해야 한다.

4. **오류 메시지 출처를 구분하면 범위가 좁혀진다**  
   `"Cannot GET /"` → Express 오류.  
   `"404: NOT_FOUND"` → Vercel 오류.

5. **Express를 Vercel serverless로 쓰려면 `export default app`이 필요하다**  
   `app.listen()`은 로컬 전용이다.

6. **`server.js`(Express) 방식은 zero-config가 반쪽짜리다**  
   `server.js`는 자동 감지되지만 `public/` CDN 서빙은 안 된다.  
   `server.js`를 `api/chat.js`로 교체하자 `vercel.json` 없이도 `public/`이 자동 서빙됐다.  
   Vercel은 `api/` 디렉토리가 있어야 프로젝트를 완전히 인식하는 것으로 보인다.

7. **AI가 제안한 방식도 직접 테스트하기 전까지는 신뢰할 수 없다**  
   Claude Web, Gemini가 `vercel.json`의 `functions`/`rewrites` 방식을 권장했지만 실제로는 동작하지 않았다.  
   직접 확인한 `vercel.json`의 `builds` + `routes`가 유일하게 동작한 방식이었다.

8. **`public/` zero-config 자동 서빙은 `api/` 디렉토리가 있어야 동작한다**  
   `server.js`만 있는 구조에서는 `public/`이 자동 서빙되지 않았다.  
   `api/chat.js`로 교체하자 `vercel.json` 없이도 `public/`이 자동 서빙됐다.  
   Vercel이 `api/` 디렉토리를 감지해야 프로젝트 구조를 제대로 인식하는 것으로 보인다.
