const $output = document.querySelector("#output");
const $addAgeBtn = document.querySelector("#addAge");
const $renameBtn = document.querySelector("#rename");
const $personName = document.querySelector("#personName");

const person = {
  name: "Harry",
  age: 30,
};

const clearPersonInfo = () => {
  $output.textContent = "";
};

const renderPersonInfo = () => {
  clearPersonInfo();
  $output.textContent = `${person.name} (${person.age}살)`;
};

const addAgeOne = () => {
  person.age++;
};

const rename = (newName) => {
  person.name = newName;
};

$addAgeBtn.addEventListener("click", () => {
  addAgeOne();
  renderPersonInfo();
});

$personName.addEventListener("keydown", (event) => {
  if (!event.isComposing && event.key === "Enter") {
    rename($personName.value);
    renderPersonInfo();
    $personName.value = "";
  }
});

$renameBtn.addEventListener("click", () => {
  rename($personName.value);
  renderPersonInfo();
  $personName.value = "";
});

renderPersonInfo();
