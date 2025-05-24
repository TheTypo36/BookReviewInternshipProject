import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  addToReadList,
  deleteFromReadList,
  getProfile,
  register,
  signIn,
  signOut,
  updateUser,
} from "../controller/userController";
import { verifyJwt } from "../middleware/auth";

const router = Router();
router.route("/register").post(register);
router.route("/sign-in").get(signIn);
router.route("/sign-out").get(verifyJwt, signOut);
router.route("/update-user").put(verifyJwt, updateUser);
router.route("/get-profile").get(getProfile);
router.route("/add-book-to-readList").post(verifyJwt, addToReadList);
router
  .route("/remove-book-from-readList")
  .delete(verifyJwt, deleteFromReadList);

export default router;
