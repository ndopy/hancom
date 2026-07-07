const MESSAGE_CLEAR_DELAY_MS = 1000 * 3;
const fruits = ["사과", "바나나"];
let messageTimer = null;

const $fruit = document.querySelector("#fruit");
const $addBtn = document.querySelector("#addBtn");
const $message = document.querySelector("#message");
const $output = document.querySelector("#output");
const $info = document.querySelector("#info");

const addFruit = () => {
  if (!$fruit.value) {
    $message.textContent = "과일을 입력하세요!";
    clearMessage();
    return;
  }

  fruits.push($fruit.value);

  $fruit.value = "";
};

const clearMessage = () => {
  if (messageTimer) {
    clearTimeout(messageTimer);
  }

  messageTimer = setTimeout(() => {
    $message.textContent = "";
  }, MESSAGE_CLEAR_DELAY_MS);
};

const clearText = () => {
  $output.textContent = "";
  $info.textContent = "";
};

const renderFruits = () => {
  clearText();

  $output.textContent = fruits.join(", ");
  $info.textContent = `개수(length) : ${fruits.length}`;
};

$fruit.addEventListener("keydown", (event) => {
  if (!event.isComposing && event.key === "Enter") {
    addFruit();
    renderFruits();
  }
});

$addBtn.addEventListener("click", () => {
  addFruit();
  renderFruits();
});

renderFruits();
