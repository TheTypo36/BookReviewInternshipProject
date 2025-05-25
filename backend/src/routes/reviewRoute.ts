import Router from "express";
import { verifyJwt } from "../middleware/auth";
import { submitReview } from "../controller/reviewController";

const router = Router();

router.route("/write-review").post(verifyJwt, submitReview);

export default router;
