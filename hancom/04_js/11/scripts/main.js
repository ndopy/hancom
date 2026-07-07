const $count = document.querySelector("#count");
const $list = document.querySelector("#list");
const $runButton = document.querySelector("#run");
const $countdownButton = document.querySelector("#countdown");

const renderApples = () => {
  $list.innerHTML = "";
  const count = Number($count.value);
  const $fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const $li = document.createElement("li");
    $li.textContent = `${i}번째 🍎`;

    $fragment.appendChild($li);
  }

  $list.appendChild($fragment);
};

const renderCountdown = () => {
  $list.innerHTML = "";
  let count = Number($count.value);
  const $fragment = document.createDocumentFragment();

  while (count > 0) {
    const $li = document.createElement("li");
    $li.textContent = count;

    $fragment.appendChild($li);
    count -= 1;
  }

  $list.appendChild($fragment);
};

$runButton.addEventListener("click", renderApples);

$countdownButton.addEventListener("click", renderCountdown);
