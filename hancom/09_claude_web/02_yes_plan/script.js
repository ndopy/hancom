// 계산기 상태 (상태 머신)
let currentInput = "0";       // 지금 입력 중인 숫자(문자열)
let previousInput = null;     // 직전에 확정한 피연산자(숫자)
let operator = null;          // 선택된 연산자("+","-","*","/")
let shouldResetDisplay = false; // 연산자/= 직후 다음 숫자 입력 시 디스플레이 초기화 여부

const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

// 디스플레이 갱신
function updateDisplay() {
  display.textContent = currentInput;
}

// 사칙연산 실행 + 부동소수점 오차 완화
function calculate(a, b, op) {
  let result;
  switch (op) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) return "Error";
      result = a / b;
      break;
    default: return b;
  }
  // 0.1 + 0.2 = 0.30000...4 같은 오차를 반올림으로 완화
  return Math.round(result * 1e10) / 1e10;
}

// 숫자 입력
function inputNumber(num) {
  if (shouldResetDisplay) {
    currentInput = num;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === "0" ? num : currentInput + num;
  }
}

// 소수점 입력 (중복 방지)
function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0.";
    shouldResetDisplay = false;
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
}

// 연산자 입력
function inputOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);

  // 이미 대기 중인 연산이 있으면 먼저 계산(연쇄 처리)
  if (previousInput !== null && operator !== null && !shouldResetDisplay) {
    const result = calculate(previousInput, inputValue, operator);
    if (result === "Error") {
      handleError();
      return;
    }
    currentInput = String(result);
    previousInput = result;
  } else {
    previousInput = inputValue;
  }

  operator = nextOperator;
  shouldResetDisplay = true;
}

// = 입력
function inputEquals() {
  if (previousInput === null || operator === null) return;

  const inputValue = parseFloat(currentInput);
  const result = calculate(previousInput, inputValue, operator);

  if (result === "Error") {
    handleError();
    return;
  }

  currentInput = String(result);
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
}

// 전체 지우기
function clearAll() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
}

// 0으로 나누기 등 에러 처리
function handleError() {
  currentInput = "Error";
  previousInput = null;
  operator = null;
  shouldResetDisplay = true; // 다음 숫자 입력 시 새로 시작
}

// 이벤트 위임: 버튼 영역 하나에만 리스너
buttons.addEventListener("click", (e) => {
  const target = e.target;
  if (target.tagName !== "BUTTON") return;

  const { number, operator: op, action } = target.dataset;

  if (number !== undefined) {
    inputNumber(target.textContent);
  } else if (op !== undefined) {
    inputOperator(op);
  } else if (action === "decimal") {
    inputDecimal();
  } else if (action === "clear") {
    clearAll();
  } else if (action === "equals") {
    inputEquals();
  }

  updateDisplay();
});
