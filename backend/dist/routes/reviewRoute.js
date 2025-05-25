"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const reviewController_1 = require("../controller/reviewController");
const router = (0, express_1.default)();
router.route("/write-review").post(auth_1.verifyJwt, reviewController_1.submitReview);
exports.default = router;
