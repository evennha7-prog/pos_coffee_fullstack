import express from "express";
import { signup, signin, signout, me } from "../controllers/auth.controller";
import authGuard from "../guards/auth.guard";
import restrict from "../guards/restrict.guard";

const router = express.Router();

router.post("/signup", authGuard, restrict("admin"), signup);
router.post("/signin", signin);
router.get("/signout", authGuard, restrict("admin", "cashier"), signout);
router.get("/me", authGuard, restrict("admin", "cashier"), me);

export default router;
