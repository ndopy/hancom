const multiply = (num1, num2) => num1 * num2;

const $a = document.querySelector("#a");
const $b = document.querySelector("#b");
const $calc = document.querySelector("#calc");
const $out = document.querySelector("#out");

const getOperandValue = ($element) => {
  return Number($element.value);
};

const getMultiplyMessage = (a, b) => {
  return `${a} x ${b} = ${multiply(a, b)}`;
};

const handleButtonClick = () => {
  const a = getOperandValue($a);
  const b = getOperandValue($b);

  $out.textContent = getMultiplyMessage(a, b);
};

$calc.addEventListener("click", handleButtonClick);
