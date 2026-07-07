const $greet = document.getElementById("greet");
const $nameInput = document.getElementById("name");
const $saveButton = document.getElementById("save");
const $removeButton = document.getElementById("remove");

const renderGreet = (userName) => {
  if (!userName) {
    $greet.textContent = `안녕하세요!`;
    return;
  }

  $greet.textContent = `안녕, ${userName}`;
};

const saveName = () => {
  const currentName = $nameInput.value;

  if (!currentName) {
    return;
  }

  localStorage.setItem("name", currentName);
};

const getName = () => {
  return localStorage.getItem("name");
};

const removeName = () => {
  localStorage.removeItem("name");
};

$saveButton.addEventListener("click", () => {
  saveName();
  renderGreet(getName());
});

$removeButton.addEventListener("click", () => {
  removeName();
  renderGreet();
});

const savedName = getName();
renderGreet(savedName);
