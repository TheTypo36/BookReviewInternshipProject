import Router from "express";
import { verifyJwt } from "../middleware/auth";
import { getReview, submitReview } from "../controller/reviewController";
import { upload } from "../middleware/multer";
const router = Router();

router.route("/write-review").post(verifyJwt, submitReview);
router.route("/get-review").get(getReview);

export default router;
