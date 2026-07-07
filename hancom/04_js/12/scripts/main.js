const $message = document.querySelector("#message");
const $runButton = document.querySelector("#run");
const $output = document.querySelector("#output");

const isEnglish = /^[a-zA-Z\s]+$/;

const getTextInfo = () => {
  const message = $message.value;

  if (!message) {
    $output.textContent = "텍스트를 입력해주세요!";
    return;
  }

  if (!isEnglish.test(message)) {
    $output.textContent = "영어만 입력해주세요!";
    return;
  }

  $output.innerHTML = `
    글자 수(length) : ${message.length} <br/>
    대문자(toUpperCase) : ${message.toUpperCase()} <br/>
    e -> E 바꾸기(replace) : ${message.replace(/e/g, "E")}
  `;
};

$runButton.addEventListener("click", getTextInfo);
