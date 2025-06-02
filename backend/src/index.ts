import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const currOrigin =
  process.env.NODE_ENV == "Production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

console.log(process.env.FRONTEND_URL);
console.log(currOrigin);
app.use(
  cors({
    origin: currOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.get("/", (req, res) => {
  res.send("<h1>hello world</h1>");
});

import userRoutes from "./routes/userRoute";
import bookRoutes from "./routes/bookRoute";
import reviewRoutes from "./routes/reviewRoute";
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/review", reviewRoutes);

const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
  console.log(`server is running at ${PORT} port`);
});
