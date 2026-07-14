import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("메시지 : ", (message) => {
  fetch("http://192.168.20.15:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch(() => console.log("서버 먼저 켜기 (node index.js"))
    .finally(() => rl.close());
});
