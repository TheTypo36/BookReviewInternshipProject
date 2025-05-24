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
exports.addBook = exports.getBook = exports.getAllBooks = void 0;
const db_1 = __importDefault(require("../db"));
const cloudinary_1 = require("../utils/cloudinary");
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    if (!page && !limit) {
        res.status(404).json({ message: "limit and page is required" });
        return;
    }
    const skip = (page - 1) * limit;
    try {
        const [books, totalBooks] = yield db_1.default.$transaction([
            db_1.default.book.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            db_1.default.book.count(),
        ]);
        const totalPage = Math.ceil(totalBooks / limit);
        res.status(200).json({
            data: books,
            pagination: {
                totalItems: totalBooks,
                itemsPerPage: limit,
                totalPage: totalPage,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalBooks ? page + 1 : null,
            },
        });
    }
    catch (error) {
        console.log(`error in fetching booking with pagination ${error}`);
        res
            .status(500)
            .json({ message: `error in fetching booking with pagination ${error}` });
    }
});
exports.getAllBooks = getAllBooks;
const getBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = parseInt(req.params.id);
    if (!bookId) {
        res.status(400).json({ message: "bookId required" });
        return;
    }
    try {
        const book = yield db_1.default.book.findFirst({
            where: {
                id: bookId,
            },
        });
        if (!book) {
            res.status(404).json({ message: `no book are found of id ${bookId}` });
            return;
        }
        res.status(200).json(book);
    }
    catch (error) {
        console.log(`interval server error ${error}`);
        res.status(500).json({ message: `interval server error ${error}` });
    }
});
exports.getBook = getBook;
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    if (req.admin == false) {
        console.log("this is user cannot add books");
        res.status(400).json({ message: "unauthorized request" });
        return;
    }
    const title = req.body.title;
    const country = req.body.country;
    const Language = req.body.Language;
    const Author = req.body.Author;
    const Year = req.body.Year;
    const page = parseInt(req.body.page);
    const Link = req.body.Link;
    const existingUser = yield db_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    const localFilePath = req.file;
    console.log(localFilePath);
    if (!localFilePath) {
        res.status(404).json({ message: "need coverImage for creation of book" });
        return;
    }
    if (!existingUser) {
        console.log("invalid user");
        return;
    }
    const coverImg = yield (0, cloudinary_1.uploadOnCloudinary)(localFilePath);
    console.log("covverimg", coverImg);
    const book = yield db_1.default.book.create({
        data: {
            title,
            country,
            coverImg,
            Language,
            Author,
            Year,
            page,
            Link,
            addedBy: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id,
        },
    });
    if (!book) {
        res.status(400).json({ message: "book is not created" });
    }
    res.status(200).json(book);
});
exports.addBook = addBook;
