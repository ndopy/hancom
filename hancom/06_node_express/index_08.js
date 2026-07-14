import express from "express";

const app = express();

app.use(express.json());

let users = [
  { id: 1, name: "철수" },
  { id: 2, name: "영희" },
  { id: 3, name: "민수" },
];

app.get("/api/users", (req, res) => {
  res.json(users);
  console.log(users);
});

app.delete("/api/users/:id", (req, res) => {
  const targetUser = users.find((user) => user.id === Number(req.params.id));

  if (!targetUser) {
    res.status(404).json({ error: "해당 유저가 존재하지 않습니다." });
    return;
  }

  users = users.filter((user) => user.id !== Number(req.params.id));

  res.json({ ok: true, remains: users });
});

app.listen(3000, async () => {
  const response = await fetch("http://localhost:3000/api/users/4", {
    method: "DELETE",
  });

  const data = await response.json();
  console.log(data);
});
