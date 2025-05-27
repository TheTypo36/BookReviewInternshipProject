"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // **Replace with your actual frontend URL**
    credentials: true, // <--- THIS IS THE KEY!
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // It's good practice to list allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // It's good practice to list allowed headers
}));
app.get("/", (req, res) => {
    res.send("<h1>hello world</h1>");
});
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const bookRoute_1 = __importDefault(require("./routes/bookRoute"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
app.use("/api/v1/user", userRoute_1.default);
app.use("/api/v1/book", bookRoute_1.default);
app.use("/api/v1/review", reviewRoute_1.default);
const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
    console.log(`server is running at ${PORT} port`);
});
