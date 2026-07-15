import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

app.post("/api/chat", async (req, res) => {
  const key = process.env.GROQ_API_KEY;

  if (!key) {
    return res.json({ reply: `(mock) ${req.body.prompt}` });
  }

  const groqResponse = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: req.body.prompt,
        },
      ],
    }),
  });

  const data = await groqResponse.json();

  res.json({
    reply: data.choices?.[0]?.message?.content || `(응답 없음)`,
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

export default app;
