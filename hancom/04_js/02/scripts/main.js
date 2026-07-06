const titleElement = document.querySelector("#title"); // . => '~의'
const buttonElement = document.getElementById("btn");

const setText = (element, text) => {
  element.textContent = text;
};

const handleButtonClick = () => {
  setText(titleElement, "Hello World!");
};

buttonElement.addEventListener("click", handleButtonClick);
