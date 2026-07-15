// ── 상태 ──────────────────────────────────────────────
// displayValue    : 지금 화면에 보이는 문자열
// firstOperand    : 저장된 첫 피연산자 (연산자를 누르면 여기 담긴다)
// operator        : 대기 중인 연산자 (+, −, ×, ÷)
// waitingForSecond: 연산자 입력 직후 = 다음 숫자로 새 값을 시작해야 함
const state = {
  displayValue: '0',
  firstOperand: null,
  operator: null,
  waitingForSecond: false,
};

const displayEl = document.getElementById('display');

// ── 화면 갱신 ─────────────────────────────────────────
function updateDisplay() {
  displayEl.textContent = state.displayValue;
}

// ── 숫자 입력 ─────────────────────────────────────────
function inputDigit(digit) {
  if (state.waitingForSecond) {
    // 연산자 직후: 새 숫자로 시작
    state.displayValue = digit;
    state.waitingForSecond = false;
  } else {
    // 앞자리가 '0' 하나뿐이면 교체, 아니면 이어붙임
    state.displayValue =
      state.displayValue === '0' ? digit : state.displayValue + digit;
  }
}

// ── 소수점 입력 ───────────────────────────────────────
function inputDecimal() {
  if (state.waitingForSecond) {
    // 연산자 직후 소수점을 누르면 '0.'으로 시작
    state.displayValue = '0.';
    state.waitingForSecond = false;
    return;
  }
  // 이미 소수점이 있으면 무시
  if (!state.displayValue.includes('.')) {
    state.displayValue += '.';
  }
}

// ── 순수 계산 함수 ────────────────────────────────────
function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? null : a / b; // 0으로 나누면 null → 오류 처리
    default:  return b;
  }
}

// 부동소수점 오차 정리 (예: 0.1 + 0.2)
function roundResult(num) {
  return Math.round(num * 1e10) / 1e10;
}

// ── 연산자 입력 ───────────────────────────────────────
function handleOperator(nextOp) {
  const inputValue = parseFloat(state.displayValue);

  // 이미 연산자만 눌린 상태에서 다른 연산자를 누르면 연산자만 교체
  if (state.operator && state.waitingForSecond) {
    state.operator = nextOp;
    return;
  }

  if (state.firstOperand === null) {
    // 첫 피연산자 저장
    state.firstOperand = inputValue;
  } else if (state.operator) {
    // 대기 중인 연산이 있으면 먼저 계산 (연속 연산: 2 + 3 + 4)
    const result = calculate(state.firstOperand, inputValue, state.operator);
    if (result === null) {
      showError();
      return;
    }
    const rounded = roundResult(result);
    state.displayValue = String(rounded);
    state.firstOperand = rounded;
  }

  state.waitingForSecond = true;
  state.operator = nextOp;
}

// ── '=' 처리 ──────────────────────────────────────────
function handleEquals() {
  if (state.operator === null || state.waitingForSecond) return;

  const inputValue = parseFloat(state.displayValue);
  const result = calculate(state.firstOperand, inputValue, state.operator);
  if (result === null) {
    showError();
    return;
  }
  state.displayValue = String(roundResult(result));
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecond = false;
}

// ── 부호 전환 (±) ─────────────────────────────────────
function toggleSign() {
  if (state.displayValue === '0') return;
  state.displayValue = String(parseFloat(state.displayValue) * -1);
}

// ── 퍼센트 (%) ────────────────────────────────────────
function inputPercent() {
  state.displayValue = String(roundResult(parseFloat(state.displayValue) / 100));
}

// ── 한 글자 지우기 (Backspace) ────────────────────────
function deleteLast() {
  // 연산자 직후엔 지울 게 없다
  if (state.waitingForSecond) return;

  const v = state.displayValue;
  // 한 자리이거나 '-3'처럼 부호+한자리만 남으면 '0'으로
  if (v.length <= 1 || (v.length === 2 && v.startsWith('-'))) {
    state.displayValue = '0';
  } else {
    state.displayValue = v.slice(0, -1);
  }
}

// ── 초기화 (AC) ───────────────────────────────────────
function resetCalculator() {
  state.displayValue = '0';
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecond = false;
}

// ── 오류 표시 ─────────────────────────────────────────
function showError() {
  resetCalculator();
  state.displayValue = '오류';
}

// ── 이벤트 위임: 버튼 그리드 하나에만 리스너 ──────────
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  // 오류 표시 상태에서 아무 버튼이나 누르면 먼저 초기화
  if (state.displayValue === '오류') resetCalculator();

  const { number, operator, action } = btn.dataset;

  if (number !== undefined) {
    inputDigit(number);
  } else if (operator !== undefined) {
    handleOperator(operator);
  } else if (action === 'decimal') {
    inputDecimal();
  } else if (action === 'equals') {
    handleEquals();
  } else if (action === 'clear') {
    resetCalculator();
  } else if (action === 'sign') {
    toggleSign();
  } else if (action === 'percent') {
    inputPercent();
  }

  updateDisplay();
});

// ── 키보드 입력 ───────────────────────────────────────
// 키 → 이미 만든 함수로 연결한다. 화면 버튼과 같은 로직을 그대로 재사용.
document.addEventListener('keydown', (e) => {
  const { key } = e;

  // 이 계산기가 처리하는 키인지 먼저 판별
  let handled = true;

  // 오류 상태에서 (초기화 키 Escape 외의) 입력이 오면 먼저 리셋
  if (state.displayValue === '오류' && key !== 'Escape') resetCalculator();

  if (key >= '0' && key <= '9') {
    inputDigit(key);
  } else if (key === '.') {
    inputDecimal();
  } else if (key === '+' || key === '-') {
    // 키보드의 -는 내부 연산자 기호 '−'(U+2212)로 매핑
    handleOperator(key === '-' ? '−' : '+');
  } else if (key === '*') {
    handleOperator('×');
  } else if (key === '/') {
    handleOperator('÷');
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    resetCalculator();
  } else if (key === '%') {
    inputPercent();
  } else {
    handled = false; // 우리가 쓰는 키가 아니면 브라우저 기본 동작 유지
  }

  if (handled) {
    e.preventDefault(); // '/' 빠른검색 등 브라우저 기본 동작 차단
    updateDisplay();
  }
});

// 초기 렌더
updateDisplay();
