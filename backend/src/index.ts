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
console.log(process.env.FRONTENT_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // **Replace with your actual frontend URL**
    credentials: true, // <--- THIS IS THE KEY!
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // It's good practice to list allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // It's good practice to list allowed headers
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
