require("dotenv").config();
const key = process.env.GROQ_API_KEY;

const main = async () => {
  const groqRes = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
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
            content:
              "groq이라는 서비스로 만들수 있는 간단한 포트폴리오 주제 같은 걸 추천해 줘.",
          },
        ],
      }),
    },
  );

  const data = await groqRes.json();
  console.log(data.choices?.[0]?.message?.content || data);
};

main();
