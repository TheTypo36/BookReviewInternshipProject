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
exports.deleteFromReadList = exports.addToReadList = exports.getReadList = exports.getProfile = exports.updateUser = exports.signOut = exports.signIn = exports.register = void 0;
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function generateAccessAndRefreshToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.default.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new Error("no user found");
        }
        try {
            const { id, name, email } = user;
            const payload = {
                _id: id,
                name: name,
                email: email,
            };
            if (!process.env.ACCESS_TOKEN_SECRET_KEY ||
                !process.env.REFRESH_TOKEN_SECRET_KEY ||
                !process.env.REFRESH_TOKEN_EXPIRY ||
                !process.env.ACCESS_TOKEN_EXPIRY) {
                throw new Error("Secret keys are missing in environment variables");
            }
            console.log(process.env.ACCESS_TOKEN_SECRET_KEY, process.env.REFRESH_TOKEN_SECRET_KEY);
            //@ts-ignore
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            });
            //@ts-ignore
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            });
            return { accessToken, refreshToken };
        }
        catch (error) {
            throw new Error(`can't generate tokens because of this error ${error}`);
        }
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        if (!name || !email || !password) {
            console.log("required field are missing");
            res.status(404).json({ message: "required Fields are missing" });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield db_1.default.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                role: "USER",
                refreshToken: "",
            },
        });
        if (!user) {
            res.status(400).json({ message: "user is not created" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log("internal server error", error);
        res.status(500).json({ message: `error in registering of user ${error}` });
    }
});
exports.register = register;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = yield db_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!existingUser) {
        res.status(404).json({ message: "user not registered" });
        return;
    }
    let match = false;
    if (existingUser.role === "USER") {
        match = yield bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password);
    }
    else {
        if (existingUser.password === password) {
            match = true;
        }
    }
    if (!match) {
        res.status(400).json({ message: "password is incorrect" });
        return;
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshToken(existingUser.id);
    existingUser.refreshToken = refreshToken;
    const loggedInUser = yield db_1.default.user.findFirst({
        where: {
            id: existingUser.id,
        },
        select: {
            name: true,
            email: true,
            createdAt: true,
            role: true,
        },
    });
    res
        .status(200)
        .cookie("refreshToeken", refreshToken)
        .cookie("accessToken", accessToken)
        .json({ loggedInUser });
});
exports.signIn = signIn;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.signOut = signOut;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.updateUser = updateUser;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getProfile = getProfile;
const getReadList = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getReadList = getReadList;
const addToReadList = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.addToReadList = addToReadList;
const deleteFromReadList = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.deleteFromReadList = deleteFromReadList;
