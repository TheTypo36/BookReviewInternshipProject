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
const options = {
    httpOnly: true,
    secure: true, // Must be true when SameSite is 'None'
    sameSite: "none", // Explicitly set 'none'
};
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
        console.log("name", name, "email", email, password, "password");
        if (!name || !email || !password) {
            console.log("required field are missing");
            res.status(404).json({ message: "required Fields are missing" });
        }
        console.log("we are here1");
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        console.log("we are here2");
        const user = yield db_1.default.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword,
                role: "USER",
                refreshToken: "",
            },
        });
        console.log("we are here3");
        if (!user) {
            res.status(400).json({ message: "user is not created" });
            return;
        }
        console.log("we are here4");
        res.status(200).json(user);
    }
    catch (error) {
        console.log("we are here5");
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
    const loggedInUser = yield db_1.default.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            refreshToken: refreshToken,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: true,
        },
    });
    res
        .status(200)
        .cookie("refreshToken", refreshToken)
        .cookie("accessToken", accessToken)
        .json({ loggedInUser, accessToken });
});
exports.signIn = signIn;
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("cookie", req.cookies);
        const user = yield db_1.default.user.findFirst({
            where: {
                id: req.user,
            },
        });
        if (!user) {
            res.status(404).json({ message: "user not found" });
            return;
        }
        yield db_1.default.user.update({
            where: {
                id: user.id,
            },
            data: {
                refreshToken: "",
            },
        });
        res.status(200).json({ message: "logged out the user" });
    }
    catch (error) {
        res
            .status(500)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: ` internal server error in loggingout  ${error}` });
    }
});
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
