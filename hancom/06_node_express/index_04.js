import express from "express";

const app = express();

const users = [
  { id: 1, name: "영희" },
  { id: 2, name: "철수" },
];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.listen(3000, () => {
  console.log("http://localhost:3000 에서 express 실행");
});
