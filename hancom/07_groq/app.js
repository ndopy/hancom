const $btn = document.querySelector("#btn");
const $prompt = document.querySelector("#question");
const $reply = document.querySelector("#reply");

$btn.addEventListener("click", async () => {
  const prompt = $prompt.value;

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    $reply.textContent = data.reply || data.error;
  } catch (error) {
    $reply.textContent = "X 서버 안 켜짐?";
  }
});
