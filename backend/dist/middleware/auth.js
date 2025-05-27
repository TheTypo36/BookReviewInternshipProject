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
exports.adminVerify = exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const verifyJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
            ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        console.log("in verify jwt", req.cookies.accessToken);
        console.log("req header", req.header("Authorization"));
        if (!token) {
            throw new Error("unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        console.log("decoded token in verify jwt", decodedToken);
        const user = yield db_1.default.user.findFirst({
            where: {
                id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id,
            },
        });
        if (!user) {
            throw new Error("invalid access Token");
        }
        console.log("user in verify", user);
        req.user = user.id;
        next();
    }
    catch (error) {
        console.log(`internal server error ${error}`);
        throw new Error(`internal server error ${error}`);
    }
});
exports.verifyJwt = verifyJwt;
const adminVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    console.log("admin user", req.user);
    if (!req.user) {
        throw new Error("no user found");
    }
    const existingUser = yield db_1.default.user.findFirst({
        where: { id: userId },
    });
    if (!existingUser) {
        throw new Error("invalid user");
    }
    if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.role) != "ADMIN") {
        req.admin = false;
        throw new Error("unauthorized request");
    }
    req.admin = true;
    next();
});
exports.adminVerify = adminVerify;
