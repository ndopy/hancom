const state = {
  displayValue:   '0',
  storedValue:    null,
  pendingOp:      null,
  waitingForNext: false,
};

const resultEl     = document.querySelector('.calc-result');
const expressionEl = document.querySelector('.calc-expression');
const buttonsEl    = document.querySelector('.calc-buttons');

/* ============================================================
   Display
   ============================================================ */
function updateDisplay() {
  resultEl.textContent = state.displayValue;

  if (state.storedValue !== null && state.pendingOp !== null) {
    expressionEl.textContent = `${state.storedValue} ${opSymbol(state.pendingOp)}`;
  } else {
    expressionEl.textContent = '';
  }

  // 결과 글자 수에 따라 폰트 동적 축소
  const len = state.displayValue.replace('-', '').replace('.', '').length;
  resultEl.style.fontSize =
    len > 9 ? '1rem'    :
    len > 6 ? '1.25rem' : '';  // '' → CSS 기본값(--t10-size) 복구

  // 선택된 연산자 버튼 강조 (is-selected 클래스)
  document.querySelectorAll('.btn--operator').forEach(btn => {
    btn.classList.toggle(
      'is-selected',
      state.waitingForNext && btn.dataset.op === state.pendingOp
    );
  });
}

function opSymbol(op) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] ?? op;
}

/* ============================================================
   계산 핵심 로직
   ============================================================ */
function calculate(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
    default:  return b;
  }
}

function formatResult(n) {
  if (n === null || !isFinite(n)) return 'Error';
  if (Number.isInteger(n)) return String(n);

  // 소수 — trailing 0 trim, 10자리 초과 시 지수 표기
  let str = String(parseFloat(n.toPrecision(10)));
  if (str.replace('-', '').replace('.', '').length > 10) {
    str = n.toPrecision(9);
  }
  return str;
}

/* ============================================================
   핸들러
   ============================================================ */
function inputDigit(digit) {
  if (digit === '.' && state.displayValue.includes('.') && !state.waitingForNext) return;

  if (state.waitingForNext) {
    state.displayValue = digit === '.' ? '0.' : digit;
    state.waitingForNext = false;
  } else {
    if (state.displayValue === '0' && digit !== '.') {
      state.displayValue = digit;
    } else {
      if (state.displayValue.replace('-', '').replace('.', '').length >= 12) return;
      state.displayValue += digit;
    }
  }
  updateDisplay();
}

function inputOperator(op) {
  const current = parseFloat(state.displayValue);

  if (state.pendingOp !== null && !state.waitingForNext) {
    const result = calculate(state.storedValue, state.pendingOp, current);
    state.displayValue = formatResult(result);
    state.storedValue  = result === null ? current : result;
  } else {
    state.storedValue = current;
  }

  state.pendingOp      = op;
  state.waitingForNext = true;
  updateDisplay();
}

function inputEquals() {
  if (state.pendingOp === null) return;

  const current = parseFloat(state.displayValue);
  const result  = calculate(state.storedValue, state.pendingOp, current);

  state.displayValue   = formatResult(result);
  state.storedValue    = null;
  state.pendingOp      = null;
  state.waitingForNext = true;
  updateDisplay();
}

function inputPercent() {
  const val = parseFloat(state.displayValue) / 100;
  state.displayValue = formatResult(val);
  updateDisplay();
}

function inputToggleSign() {
  if (state.displayValue === '0' || state.displayValue === 'Error') return;
  state.displayValue = state.displayValue.startsWith('-')
    ? state.displayValue.slice(1)
    : '-' + state.displayValue;
  updateDisplay();
}

function clearAll() {
  state.displayValue   = '0';
  state.storedValue    = null;
  state.pendingOp      = null;
  state.waitingForNext = false;
  updateDisplay();
}

function backspace() {
  if (state.waitingForNext || state.displayValue === 'Error') return;
  if (state.displayValue.length <= 1 ||
      (state.displayValue.length === 2 && state.displayValue.startsWith('-'))) {
    state.displayValue = '0';
  } else {
    state.displayValue = state.displayValue.slice(0, -1);
  }
  updateDisplay();
}

/* ============================================================
   이벤트 위임 — .calc-buttons에 단일 click 리스너
   ============================================================ */
buttonsEl.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.digit !== undefined) { inputDigit(btn.dataset.digit); return; }
  if (btn.dataset.op    !== undefined) { inputOperator(btn.dataset.op); return; }

  switch (btn.dataset.action) {
    case 'clear':       clearAll();        break;
    case 'toggle-sign': inputToggleSign(); break;
    case 'percent':     inputPercent();    break;
    case 'equals':      inputEquals();     break;
  }
});

/* ============================================================
   키보드 지원
   ============================================================ */
document.addEventListener('keydown', e => {
  if (/^[0-9]$/.test(e.key)) { inputDigit(e.key); return; }
  if (e.key === '.')                       { inputDigit('.'); return; }
  if (e.key === '+')                       { inputOperator('+'); return; }
  if (e.key === '-')                       { inputOperator('-'); return; }
  if (e.key === '*')                       { inputOperator('*'); return; }
  if (e.key === '/')                       { e.preventDefault(); inputOperator('/'); return; }
  if (e.key === 'Enter' || e.key === '=') { inputEquals(); return; }
  if (e.key === 'Escape')                  { clearAll(); return; }
  if (e.key === '%')                       { inputPercent(); return; }
  if (e.key === 'Backspace')               { backspace(); return; }
});

/* 초기 렌더 */
updateDisplay();
