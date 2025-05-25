import { Router } from "express";
import {
  addBook,
  getAllBooks,
  getBook,
  removeBook,
} from "../controller/bookController";
import { adminVerify, verifyJwt } from "../middleware/auth";
import { upload } from "../middleware/multer";

const router = Router();

router.route("/getAllBooks").get(getAllBooks);

router.route("/getBook/:id").get(getBook);

router
  .route("/add-book")
  .post(upload.single("coverImg"), verifyJwt, adminVerify, addBook);

router.route("/remove-book").delete(verifyJwt, adminVerify, removeBook);
export default router;
