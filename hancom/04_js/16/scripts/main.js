// 1. console.log — JS의 "프린트", 실행 중 값 보기 (F12 → Console 탭)
const price = 1000;
const count = 3;
console.log("price:", price); // price: 1000
console.log("총합:", price * count); // 총합: 3000
console.log(price, count, "확인"); // 여러 값 한 번에 (쉼표로 나열)

// 2. typeof — 값의 종류 확인 (숫자인지 글자인지 헷갈릴 때)
console.log(typeof price); // "number"
console.log(typeof "3"); // "string" (따옴표 있으면 글자!)

// 3. debugger — 이 줄에서 실행이 멈춤 (F12 열려 있을 때만 작동)
const sum = price + count;
debugger; // 멈춘 상태로 콘솔에 price·sum 쳐서 값 확인 → ▶로 재개
console.log("sum:", sum);

// 4. 자주 만나는 에러 — id 오타로 요소를 못 찾음
const btn = document.querySelector("#by"); // 진짜 id는 #buy인데 오타
btn.addEventListener("click", () => {});
// ❌ TypeError: Cannot read properties of null (reading 'addEventListener')
//    → btn이 null (못 찾음) → id 철자 확인 (#by → #buy)
