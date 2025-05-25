"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReview = exports.getReview = void 0;
const db_1 = __importDefault(require("../db"));
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bookId = parseInt((_a = req.query) === null || _a === void 0 ? void 0 : _a.bookId);
    if (!bookId) {
        res
            .status(404)
            .json({ message: "bookid required for fetching the reviews" });
        return;
    }
    const book = yield db_1.default.book.findFirst({
        where: {
            id: bookId,
        },
        include: {
            reviews: true,
        },
    });
    if (!book) {
        res.status(404).json({ message: "book is not in the database" });
    }
    res.status(200).json(book);
});
exports.getReview = getReview;
const submitReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.user;
        const existingUser = yield db_1.default.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!existingUser) {
            res.status(200).json({ message: "user not found" });
            return;
        }
        const content = req.body.content;
        const rating = parseInt(req.body.rating);
        const bookId = parseInt((_a = req.query) === null || _a === void 0 ? void 0 : _a.bookId);
        const review = yield db_1.default.review.create({
            data: {
                content,
                rating,
                bookId,
                userId: existingUser.id,
            },
        });
        if (!review) {
            res.status(400).json({ message: "review is not creating" });
        }
        res.status(200).json({
            message: `review created by user ${userId} of book ${bookId}`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `internal server error ${error}` });
    }
});
exports.submitReview = submitReview;
