"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controller/bookController");
const router = (0, express_1.Router)();
router.route("/getAllBooks").get(bookController_1.getAllBooks);
exports.default = router;
