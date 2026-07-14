import express from "express";

const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "철수" },
  { id: 2, name: "영희" },
];

app.put("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: "존재하지 않는 유저입니다." });
  }

  user.name = req.body.name;
  res.json(user);
});

app.get("/api/users", (req, res) => {
  res.json(users);
  console.log(users);
});

app.listen(3000, async () => {
  await fetch("http://localhost:3000/api/users");

  const res = await fetch("http://localhost:3000/api/users/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "민수" }),
  });

  const data = await res.json();
  console.log(`변경된 이름 : ${data.name}`);

  await fetch("http://localhost:3000/api/users");
});
