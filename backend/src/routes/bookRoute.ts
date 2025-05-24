import { Router } from "express";
import { getAllBooks } from "../controller/bookController";

const router = Router();

router.route("/getAllBooks").get(getAllBooks);

export default router;
