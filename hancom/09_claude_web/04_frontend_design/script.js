/* ============================================================
   ADDO-X 200 — 프린팅 가산기 로직
   - current  : 지금 입력 중인 문자열(디스플레이에 보이는 값)
   - previous : 저장된 피연산자(숫자) 또는 null
   - operator : 대기 중인 연산자('+', '-', '*', '/') 또는 null
   - overwrite: true면 다음 숫자 입력이 current를 덮어씀(연산자/= 직후)
   ============================================================ */

const OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

const state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: true,
};

const displayEl = document.getElementById("display");
const readoutOpEl = document.getElementById("readoutOp");
const tapeEl = document.getElementById("tape");

/* ---------- 숫자 포맷 ---------- */
// 결과값의 부동소수점 오차를 정리한다. (0.1 + 0.2 → 0.3)
function clean(n) {
  return parseFloat(n.toPrecision(12));
}

// 문자열에 천 단위 구분 쉼표를 붙인다. 입력 중인 소수점/소수부는 그대로 둔다.
function group(str) {
  const negative = str.startsWith("-");
  const body = negative ? str.slice(1) : str;
  const [intPart, decPart] = body.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  let out = grouped;
  if (decPart !== undefined) out += "." + decPart;      // 소수부 유지
  else if (body.endsWith(".")) out += ".";              // 방금 찍은 소수점 유지
  return (negative ? "-" : "") + out;
}

/* ---------- 화면 갱신 ---------- */
function render() {
  displayEl.textContent = group(state.current);
  readoutOpEl.textContent = state.operator ? OP_SYMBOL[state.operator] : "";
}

/* ---------- 테이프 인쇄 ---------- */
function printLine(value, opText = "", variant = "") {
  const line = document.createElement("p");
  line.className = "tape__line tape__line--print";
  if (variant) line.classList.add(`tape__line--${variant}`);

  const num = document.createElement("span");
  num.className = "tape__num";
  num.textContent = value;

  const op = document.createElement("span");
  op.className = "tape__op";
  op.textContent = opText;

  line.append(num, op);
  tapeEl.append(line);
  tapeEl.scrollTop = tapeEl.scrollHeight;   // 항상 최신 줄로 스크롤
}

// 피연산자 한 줄 인쇄. 뺄셈이거나 음수면 빨간색으로.
function printOperand(numStr, opChar) {
  const isNegative = numStr.trim().startsWith("-");
  const variant = opChar === "-" || isNegative ? "red" : "";
  printLine(group(numStr), OP_SYMBOL[opChar] ?? "", variant);
}

/* ---------- 입력 처리 ---------- */
function inputDigit(d) {
  if (state.overwrite) {
    state.current = d;
    state.overwrite = false;
  } else {
    state.current = state.current === "0" ? d : state.current + d;
  }
  render();
}

function inputDecimal() {
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
  render();
}

function toggleSign() {
  if (state.current === "0") return;
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;
  render();
}

function percent() {
  state.current = String(clean(parseFloat(state.current) / 100));
  state.overwrite = true;
  render();
}

// 두 수를 실제로 계산한다. 0으로 나누기는 에러로 처리.
function compute(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? null : a / b;
  }
}

function chooseOperator(op) {
  // 연산자를 연속으로 누르면 마지막 것만 갱신
  if (state.operator && state.overwrite) {
    state.operator = op;
    readoutOpEl.textContent = OP_SYMBOL[op];
    return;
  }

  const inputValue = parseFloat(state.current);

  if (state.previous === null) {
    // 첫 피연산자 확정
    printOperand(state.current, op);
    state.previous = inputValue;
  } else {
    // 이미 대기 중인 연산이 있으면 먼저 계산(연쇄 계산)
    const result = compute(state.previous, inputValue, state.operator);
    if (result === null) return divideByZeroError();
    const cleaned = clean(result);
    printOperand(state.current, op);
    state.previous = cleaned;
  }

  state.operator = op;
  state.overwrite = true;
  render();
}

function equals() {
  if (state.operator === null || state.previous === null) return;

  const inputValue = parseFloat(state.current);
  const result = compute(state.previous, inputValue, state.operator);
  if (result === null) return divideByZeroError();

  const cleaned = clean(result);
  // 마지막 피연산자는 '=' 기호로 인쇄하되, 뺄셈/음수면 빨간색으로.
  const isNeg = state.current.trim().startsWith("-");
  const variant = state.operator === "-" || isNeg ? "red" : "";
  printLine(group(state.current), "=", variant);
  printTotal(cleaned);

  state.current = String(cleaned);
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  render();
}

function printTotal(value) {
  const str = group(String(value));
  const line = document.createElement("p");
  line.className = "tape__line tape__line--print tape__line--total";
  const num = document.createElement("span");
  num.className = "tape__num";
  num.textContent = str;
  const star = document.createElement("span");
  star.className = "tape__op";
  star.textContent = "TOTAL ✻";
  line.append(num, star);
  tapeEl.append(line);
  tapeEl.scrollTop = tapeEl.scrollHeight;
}

function divideByZeroError() {
  printLine("0 으로 나눌 수 없음", "ERR", "red");
  clearEntry();       // 현재 입력만 리셋, 이력은 유지
  state.previous = null;
  state.operator = null;
  render();
}

/* ---------- 지우기 ---------- */
function clearEntry() {
  state.current = "0";
  state.overwrite = true;
  render();
}

function allClear() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
  render();
}

function tearTape() {
  tapeEl.innerHTML = "";
  const p = document.createElement("p");
  p.className = "tape__line tape__line--muted";
  p.textContent = "— 테이프 시작 —";
  tapeEl.append(p);
}

/* ---------- 라우팅 ---------- */
function handleAction(action) {
  switch (action) {
    case "decimal":   return inputDecimal();
    case "sign":      return toggleSign();
    case "percent":   return percent();
    case "clear":     return clearEntry();
    case "all-clear": return allClear();
    case "equals":    return equals();
  }
}

/* ---------- 클릭 이벤트(위임) ---------- */
document.querySelector(".keys").addEventListener("click", (e) => {
  const key = e.target.closest(".key");
  if (!key) return;

  if (key.dataset.digit !== undefined) inputDigit(key.dataset.digit);
  else if (key.dataset.op !== undefined) chooseOperator(key.dataset.op);
  else if (key.dataset.action !== undefined) handleAction(key.dataset.action);
});

document.getElementById("tearTape").addEventListener("click", tearTape);

/* ---------- 키보드 입력 ---------- */
const KEY_MAP = {
  "+": () => chooseOperator("+"),
  "-": () => chooseOperator("-"),
  "*": () => chooseOperator("*"),
  "/": () => chooseOperator("/"),
  "=": equals,
  Enter: equals,
  Escape: allClear,
  "%": percent,
  ".": inputDecimal,
};

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    flash(`[data-digit="${e.key}"]`);
    return inputDigit(e.key);
  }
  if (e.key === "Backspace") return backspace();

  const fn = KEY_MAP[e.key];
  if (fn) {
    if (e.key === "Enter") e.preventDefault();   // 폼/포커스 기본동작 방지
    flashForKey(e.key);
    fn();
  }
});

// 백스페이스: 마지막 글자 삭제
function backspace() {
  if (state.overwrite) return;
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : "0";
  if (state.current === "-" || state.current === "0") {
    state.current = "0";
    state.overwrite = true;
  }
  render();
}

/* ---------- 키보드 눌림 시각 피드백 ---------- */
function flash(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.add("is-press");
  setTimeout(() => el.classList.remove("is-press"), 90);
}

function flashForKey(key) {
  const opSel = { "+": '+', "-": '-', "*": '*', "/": '/' };
  if (opSel[key]) return flash(`[data-op="${CSS.escape(key)}"]`);
  const actionByKey = {
    "=": "equals", Enter: "equals", Escape: "all-clear",
    "%": "percent", ".": "decimal",
  };
  if (actionByKey[key]) flash(`[data-action="${actionByKey[key]}"]`);
}

/* ---------- 초기 렌더 ---------- */
render();
