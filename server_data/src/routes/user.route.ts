import express from "express";
import restrict from "../guards/restrict.guard";
import {
  findAll,
  findOne,
  update,
  remove,
} from "../controllers/user.controller";

const router = express.Router();

router.route("/").get(restrict("admin"), findAll);

router
  .route("/:id")
  .get(restrict("admin"), findOne)
  .patch(restrict("admin"), update)
  .delete(restrict("admin"), remove);

export default router;
