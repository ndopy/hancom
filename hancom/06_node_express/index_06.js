import express from "express";

const app = express();

app.use(express.json());

app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  console.log("받은 메시지 : ", message);
  res.json({ ok: true, 받은문장: message });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
