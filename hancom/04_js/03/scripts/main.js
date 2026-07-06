const nameInput = document.getElementById("name");
const buttonElement = document.getElementById("greet");
const outElement = document.getElementById("out");

const setName = (element, newName) => {
  element.textContent = `안녕, ${newName}`;
};

const handleButtonClick = () => {
  setName(outElement, nameInput.value);
};

buttonElement.addEventListener("click", handleButtonClick);
