# 오늘 학습한 내용

## [React] 여행 플래너 미니 프로젝트 트러블슈팅 모음

오늘 TourAPI + Kakao Maps를 활용한 여행 코스 플래너를 구현하고 Netlify에 배포하는 과정에서 겪은 버그들을 정리한다.

---

### 1. 스테일 클로저(Stale Closure) — `includes()` 중복 체크가 동작하지 않는 문제

#### 현상

코스에 같은 장소를 두 번 추가하지 못하도록 아래와 같이 early return을 작성했는데, 여전히 중복 추가가 됐다.

```js
function handleAddDestinationClick(place) {
  const newDestination = place.title;

  if (destinations.includes(newDestination)) {
    return; // 중복이면 추가하지 않음 — 그런데 작동 안 함
  }

  setDestinations((prev) => [...prev, newDestination]);
}
```

#### 원인

`handleAddDestinationClick`은 Kakao Maps 마커의 이벤트 리스너(`button.addEventListener`) 안에서 호출된다. 마커는 `places`가 바뀔 때만 다시 렌더링되므로, 이벤트 리스너가 캡처하는 `onAdd`(= `handleAddDestinationClick`)는 마커가 마지막으로 생성될 당시의 클로저다.

장소를 한 번 추가하면 `destinations` 상태는 `['A']`로 바뀌고 App이 리렌더링되지만, 마커 이벤트 리스너는 이전 클로저를 그대로 참조한다. 그 클로저 안의 `destinations`는 여전히 `[]`이므로 `includes('A')`가 항상 `false`를 반환한다.

#### 해결

중복 체크를 `setDestinations`의 함수형 업데이트 콜백 안으로 옮긴다. 콜백의 `prev`는 클로저가 아닌 **호출 시점의 실제 최신 상태**를 받아오기 때문에 스테일 클로저 문제가 없다.

```js
function handleAddDestinationClick(place) {
  setDestinations((prev) => {
    if (prev.includes(place.title)) {
      return prev; // 변경 없음
    }
    return [...prev, place.title];
  });
}
```

> **핵심:** 이벤트 리스너처럼 "오래된 시점에 캡처된" 함수 안에서 state를 읽어야 할 때는, 값 대신 함수를 `setState`에 넘겨 `prev`로 최신 state를 받아야 한다.

---

### 2. 객체를 구조분해할당으로 받을 때 키 이름이 달라 생긴 버그

#### 현상

SearchResult에서 카드를 클릭해도 지도가 이동하지 않았다.

#### 원인

SearchResult에서는 `{ mapx, mapy }`를 넘겼는데, App.jsx의 핸들러는 `{ newMapx, newMapy }`로 구조분해했다.

```js
// SearchResult.jsx
onCardClick({ mapx: place.mapx, mapy: place.mapy })

// App.jsx — 키 이름이 달라 undefined가 됨
function handlePlaceCardClick({ newMapx, newMapy }) {
  setMapCenter({ mapx: newMapx, mapy: newMapy }); // undefined, undefined
}
```

#### 해결

구조분해할당은 전달받은 객체의 **키 이름**과 정확히 일치해야 한다. 일반 인수(`fn(a, b)`)는 순서가 중요하지만, 객체 구조분해(`fn({ mapx, mapy })`)는 순서 무관하게 키 이름이 맞아야 한다.

```js
function handlePlaceCardClick({ mapx, mapy }) {
  setMapCenter({ mapx, mapy });
}
```

---

### 3. `setState` 콜백이 `undefined`를 반환하면 state가 오염된다

#### 현상

중복 체크를 `setDestinations` 콜백 안으로 옮기는 과정에서 실수로 아래처럼 작성했다.

```js
setDestinations((prev) => {
  if (prev.includes(newDestination)) {
    return; // ← undefined 반환!
  }
  return [...prev, newDestination];
});
```

이후 `TripCourse`에서 `destinations.length`를 읽는 시점에 에러가 발생했다.

```
Uncaught TypeError: Cannot read properties of undefined (reading 'length')
```

#### 원인

`setState`에 함수를 넘기면 그 함수의 **반환값이 새 state**가 된다. `return;`은 `undefined`를 반환하므로 `destinations` 자체가 `undefined`로 설정된다. 코드를 고쳐도 이미 메모리에 올라간 state가 `undefined`이기 때문에 에러가 계속 발생한다.

#### 해결

중복일 때는 `return prev` 또는 `return [...prev]`로 기존 배열을 반환해야 한다. 이미 state가 오염된 경우에는 **브라우저 강력 새로고침**으로 state를 초기화하면 된다.

---

### 4. Netlify 배포 시 TourAPI 요청 실패 — Vite 프록시는 개발 서버 전용

#### 현상

로컬에서는 잘 되던 TourAPI 검색이 Netlify 배포 후 전혀 동작하지 않았다.

#### 원인

`vite.config.js`의 `server.proxy` 설정은 **Vite 개발 서버**에서만 동작한다. `npm run build`로 빌드한 정적 파일을 서빙하는 Netlify에는 이 프록시가 존재하지 않아서, `/tour/...` 요청이 TourAPI로 전달되지 않는다.

#### 해결

프로젝트 루트에 `netlify.toml`을 추가해 Netlify가 서버 측에서 요청을 대신 전달하도록 설정한다.

```toml
[[redirects]]
  from = "/tour/*"
  to = "https://apis.data.go.kr/:splat"
  status = 200
  force = true
```

---

### 5. Netlify Publish directory 오설정 — 소스 파일이 그대로 서빙된 문제

#### 현상

배포 후 브라우저 콘솔에 아래 에러가 나타났다.

```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "application/octet-stream".
```

Netlify의 Deploy file browser를 확인하니 `src/`, `eslint.config.js` 등 소스 파일이 그대로 배포되어 있었다.

#### 원인

Netlify에서 **Base directory**를 `hancom/05_react/mini`로 설정하면, **Publish directory**는 Base directory 기준 상대경로가 된다. Publish directory를 비워두면 Base directory 자체(소스 루트)가 서빙된다.

#### 해결

Publish directory에 `dist`를 입력해 빌드 결과물 폴더를 지정하고, Build command에 `npm run build`를 입력한 뒤 재배포한다.

---

### 6. 화살표 오버레이가 지도에 나타나지 않는 문제 — API 응답값의 타입

#### 현상

폴리라인의 중간 지점에 방향 화살표 `CustomOverlay`를 추가했는데 지도에 전혀 표시되지 않았다.

#### 원인

TourAPI는 `mapx`(경도)와 `mapy`(위도)를 **문자열 타입**으로 반환한다. 중간 지점 좌표를 계산할 때 `+` 연산자를 쓰면 숫자 덧셈이 아닌 **문자열 연결**이 발생한다.

```js
// d1.mapy = "37.394", d2.mapy = "37.401" (둘 다 string)
const midLat = (d1.mapy + d2.mapy) / 2;
// → ("37.394" + "37.401") / 2
// → "37.39437.401" / 2
// → NaN
```

`NaN`이 좌표로 들어가면 `LatLng`가 유효하지 않아 오버레이가 지도 밖에 위치하거나 렌더링에 실패한다.

#### 해결

`parseFloat()`으로 명시적 타입 변환 후 연산한다.

```js
const midLat = (parseFloat(d1.mapy) + parseFloat(d2.mapy)) / 2;
const midLng = (parseFloat(d1.mapx) + parseFloat(d2.mapx)) / 2;
```

> **교훈:** 외부 API에서 받은 숫자처럼 보이는 값도 실제로는 문자열일 수 있다. 산술 연산 전에 타입을 확인하거나 명시적으로 변환하는 습관이 필요하다.

---

### 마무리

오늘 만난 버그들을 유형별로 정리하면 다음과 같다.

| 유형 | 원인 | 핵심 해결책 |
|------|------|------------|
| 스테일 클로저 | 이벤트 리스너가 오래된 state 캡처 | `setState(prev => ...)` 함수형 업데이트 |
| 구조분해할당 키 불일치 | 보내는 키와 받는 키 이름 다름 | 객체 구조분해는 키 이름 일치 필수 |
| state 오염 | `setState` 콜백에서 `undefined` 반환 | 반드시 새 state 값 `return` |
| Netlify 배포 | Vite 프록시는 개발 서버 전용 | `netlify.toml` 리다이렉트 설정 |
| 빌드 결과물 미서빙 | Publish directory 미설정 | `dist` 명시 |
| API 타입 문제 | 문자열 `+` 연산 → 문자열 연결 | `parseFloat()` 명시적 변환 |
