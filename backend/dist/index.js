"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use(express_1.default.static("public"));
// app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("<h1>hello world</h1>");
});
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const bookRoute_1 = __importDefault(require("./routes/bookRoute"));
app.use("/api/v1/user", userRoute_1.default);
app.use("/api/v1/book", bookRoute_1.default);
// app.use("/api/v1/review");
const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
    console.log(`server is running at ${PORT} port`);
});
