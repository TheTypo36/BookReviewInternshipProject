import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  addToReadList,
  deleteFromReadList,
  getProfile,
  getReadList,
  register,
  signIn,
  signOut,
  updateUser,
} from "../controller/userController";
import { verifyJwt } from "../middleware/auth";

const router = Router();
router.route("/register").post(register);
router.route("/sign-in").post(signIn);
router.route("/sign-out").get(signOut);
router.route("/update-user").put(verifyJwt, updateUser);
router.route("/get-profile").get(getProfile);
router.route("/get-read-list").get(verifyJwt, getReadList);
router.route("/add-book-to-read-list").post(verifyJwt, addToReadList);
router
  .route("/remove-book-from-read-list")
  .delete(verifyJwt, deleteFromReadList);

export default router;
