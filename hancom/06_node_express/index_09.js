import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "철수" }]);
});

app.listen(3000, () => {
  console.log("http://localhost:3000/api/users");
});
