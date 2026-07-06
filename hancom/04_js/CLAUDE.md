# 04_js 작업 규칙

## 실습 폴더 자동 생성

이 폴더(`04_js`)는 `01`, `02`, ... 처럼 두 자리 번호로 된 실습 폴더들로 구성되며, 각 폴더는 `index.html` + `scripts/main.js` + `styles/main.css` 구조를 가진다.

사용자가 대화 중 순수 번호(예: "10")나 "10번", "10번 폴더 만들어줘/생성해줘" 같은 짧은 요청을 하면, 아래 절차에 따라 새 실습 폴더를 자동으로 생성한다. 별도 확인 질문 없이 바로 생성한다.

### 번호 형식
- 두 자리 미만이면 앞에 0을 채워 2자리로 맞춘다 (`5` → `05`).
- 이미 2자리 이상이면 그대로 사용한다 (`10` → `10`, `100` → `100`).

### 생성 전 확인
- `04_js/<NN>` 폴더가 이미 존재하면 아무 것도 만들지 않고 이미 존재한다고 알린다. 절대 덮어쓰지 않는다.

### 생성 절차 (존재하지 않을 때만)
1. `04_js/<NN>/scripts/`, `04_js/<NN>/styles/` 디렉토리 생성
2. `04_js/template/index.html`을 `04_js/<NN>/index.html`로 그대로 복사 (내용 수정 없이)
3. `04_js/<NN>/scripts/main.js`를 빈 파일(0바이트)로 생성
4. `04_js/<NN>/styles/main.css`를 빈 파일(0바이트)로 생성
5. 무엇을 생성했는지 간단히 확인 메시지 출력

### 템플릿 기준 (`04_js/template/index.html`, 그대로 복사)
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="./styles/main.css" />
    <script defer src="./scripts/main.js"></script>

    <title>Document</title>
  </head>
  <body>
    <!-- 본문 -->
  </body>
</html>
```
</content>
