import express from "express";
import { uploadFile, removeFile } from "../controllers/upload.controller";
import restrict from "../guards/restrict.guard";

const router = express.Router();

router.post("/", restrict("admin"), uploadFile);
router.delete("/:imageUrl", restrict("admin"), removeFile);

export default router;
