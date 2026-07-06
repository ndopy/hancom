const $flavor = document.querySelector("#flavor");
const $check = document.querySelector("#check");
const $result = document.querySelector("#result");

const getFlavorMessage = (flavor) => {
  let text;

  if (flavor === "chocolate") {
    text = "와! 초코 아이스크림 좋아! 🍫";
  } else if (flavor === "vanilla") {
    text = "바닐라도 깔끔하니 좋지! 🍦";
  } else {
    text = "음... 그래도 초코가 최고인데...";
  }

  return text;
};

const handleClickButton = () => {
  const flavor = $flavor.value;
  $result.textContent = getFlavorMessage(flavor);
};

$check.addEventListener("click", handleClickButton);
