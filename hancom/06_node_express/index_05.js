import express from "express";

const app = express();

const users = [
  { id: 1, name: "영희" },
  { id: 2, name: "철수" },
  { id: 3, name: "훈이" },
];

app.get("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: "해당 유저는 존재하지 않습니다." });
  }

  res.json(user);
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
