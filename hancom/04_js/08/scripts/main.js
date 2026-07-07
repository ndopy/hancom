let count = 0;

const $btn = document.querySelector("#btn");
const $count = document.querySelector("#count");

const addOne = () => count++;

const renderText = (x) => {
  $count.textContent = `${x}번 눌렀어요!`;
};

$btn.addEventListener("click", () => {
  addOne();
  renderText(count);
});
