import { Router } from "express";
import {
  addToReadList,
  deleteFromReadList,
  getProfile,
  register,
  signIn,
  signOut,
  updateUser,
} from "../controller/userController";

const router = Router();

router.route("/register").post(register);
router.route("/sign-in").get(signIn);
router.route("/sign-out").get(signOut);
router.route("/update-user").put(updateUser);
router.route("/get-profile").get(getProfile);
router.route("/add-book-to-readList").post(addToReadList);
router.route("/remove-book-from-readList").delete(deleteFromReadList);

export default router;
