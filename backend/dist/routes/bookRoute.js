"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controller/bookController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.route("/getAllBooks").get(bookController_1.getAllBooks);
router.route("/getBook/:id").get(bookController_1.getBook);
router
    .route("/add-book")
    .post(multer_1.upload.single("coverImg"), auth_1.verifyJwt, auth_1.adminVerify, bookController_1.addBook);
router.route("/remove-book").delete(auth_1.verifyJwt, auth_1.adminVerify, bookController_1.removeBook);
exports.default = router;
