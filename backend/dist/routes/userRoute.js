"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.route("/register").post(userController_1.register);
router.route("/sign-in").post(userController_1.signIn);
router.route("/sign-out").get(userController_1.signOut);
router.route("/update-user").put(auth_1.verifyJwt, userController_1.updateUser);
router.route("/get-profile").get(userController_1.getProfile);
router.route("/get-read-list").get(auth_1.verifyJwt, userController_1.getReadList);
router.route("/add-book-to-read-list").post(auth_1.verifyJwt, userController_1.addToReadList);
router
    .route("/remove-book-from-read-list")
    .delete(auth_1.verifyJwt, userController_1.deleteFromReadList);
exports.default = router;
