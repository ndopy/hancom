const $operandA = document.querySelector("#operandA");
const $operandB = document.querySelector("#operandB");
const $operator = document.querySelector("#operator");
const $calc = document.querySelector("#calc");
const $out = document.querySelector("#out");

const handleButtonClick = () => {
  const operandA = Number($operandA.value);
  const operandB = Number($operandB.value);
  const operator = $operator.value;

  let result;
  if (operator === "+") {
    result = operandA + operandB;
  } else if (operator === "-") {
    result = operandA - operandB;
  } else if (operator === "*") {
    result = operandA * operandB;
  } else {
    result = operandA / operandB;
  }

  $out.textContent = `${operandA} ${operator} ${operandB} = ${result}`;
};

$calc.addEventListener("click", handleButtonClick);
