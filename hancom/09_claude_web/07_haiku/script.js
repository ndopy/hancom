// State variables
let currentInput = '0';
let prevInput = '';
let operator = null;
let shouldReset = false;

// DOM elements
const expressionEl = document.querySelector('.expression');
const resultEl = document.querySelector('.result');
const buttonsContainer = document.querySelector('.buttons');

// Update display
function updateDisplay() {
  const operatorSymbol = operator ? ` ${operator} ` : '';
  expressionEl.textContent = prevInput + operatorSymbol;
  resultEl.textContent = formatNumber(currentInput);
}

// Format number for display
function formatNumber(num) {
  if (num === 'Error') return 'Error';
  const numValue = parseFloat(num);
  if (isNaN(numValue)) return '0';
  if (Number.isInteger(numValue)) {
    return numValue.toLocaleString('ko-KR');
  }
  return num;
}

// Handle digit input
function handleDigit(value) {
  if (shouldReset) {
    currentInput = value;
    shouldReset = false;
  } else {
    // Prevent multiple leading zeros
    if (currentInput === '0' && value !== '.') {
      currentInput = value;
    } else if (currentInput.length < 12) {
      currentInput += value;
    }
  }
  updateDisplay();
}

// Handle decimal point
function handleDecimal() {
  if (shouldReset) {
    currentInput = '0.';
    shouldReset = false;
  } else if (!currentInput.includes('.')) {
    if (currentInput.length < 11) {
      currentInput += '.';
    }
  }
  updateDisplay();
}

// Handle operator
function handleOperator(op) {
  if (operator && !shouldReset) {
    // Chain operations: calculate previous result first
    calculate();
  }
  prevInput = currentInput;
  operator = op;
  shouldReset = true;
  updateDisplay();
}

// Calculate result
function calculate() {
  if (!operator || !prevInput) return;

  const prev = parseFloat(prevInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) {
    currentInput = 'Error';
    updateDisplay();
    return;
  }

  let result;
  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        currentInput = 'Error';
        operator = null;
        prevInput = '';
        updateDisplay();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  // Limit precision
  if (!Number.isInteger(result)) {
    result = parseFloat(result.toPrecision(10));
  }

  currentInput = result.toString();
  operator = null;
  prevInput = '';
  shouldReset = true;
  updateDisplay();
}

// Handle equals
function handleEquals() {
  if (!operator || shouldReset) return;
  calculate();
}

// Clear all
function handleClear() {
  currentInput = '0';
  prevInput = '';
  operator = null;
  shouldReset = false;
  updateDisplay();
}

// Backspace
function handleBackspace() {
  if (shouldReset || currentInput === '0') return;
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

// Event delegation
buttonsContainer.addEventListener('click', (e) => {
  if (!e.target.matches('button')) return;

  const btn = e.target;
  const type = btn.dataset.type;
  const value = btn.dataset.value;
  const op = btn.dataset.operator;

  if (type === 'digit') {
    if (value === '.') {
      handleDecimal();
    } else {
      handleDigit(value);
    }
  } else if (type === 'operator') {
    handleOperator(op);
  } else if (type === 'equals') {
    handleEquals();
  } else if (type === 'clear') {
    handleClear();
  } else if (type === 'backspace') {
    handleBackspace();
  }
});

// Initialize display
updateDisplay();
