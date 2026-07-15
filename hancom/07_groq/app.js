const $btn = document.querySelector("#btn");
const $prompt = document.querySelector("#question");
const $messages = document.querySelector(".chat-messages");
const $chatContainer = document.querySelector(".chat-container");

$btn.addEventListener("click", async () => {
  const prompt = $prompt.value;

  generateUserMessage(prompt);

  $prompt.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    const reply = data.reply || data.error;

    generateBotMessage(reply);
  } catch (error) {
    generateBotMessage("X 서버 안 켜짐?");
  }
});

function generateUserMessage(message) {
  const $messageUser = document.createElement("div");
  $messageUser.classList.add("message", "user");
  $messageUser.textContent = message;

  $messages.appendChild($messageUser);
  $chatContainer.classList.add("has-messages");
}

function generateBotMessage(message) {
  const $messageBot = document.createElement("div");
  $messageBot.classList.add("message", "bot");
  $messageBot.textContent = message;

  $messages.appendChild($messageBot);
  $messages.scrollTop = $messages.scrollHeight;
}
