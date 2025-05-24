import express from "express";
import dotenv from "dotenv";
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});

const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
  console.log(`serve is running at ${PORT} port`);
});
