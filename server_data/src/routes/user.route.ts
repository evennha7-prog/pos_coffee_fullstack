import express from "express";
import {
  create,
  findAll,
  findOne,
  remove,
  update,
} from "../controllers/user.controller";
import restrict from "../guards/restrict.guard";

const router = express.Router();

router
  .route("/")
  .post(restrict("admin"), create)
  .get(restrict("admin"), findAll);

router
  .route("/:id")
  .get(restrict("admin"), findOne)
  .put(restrict("admin"), update)
  .patch(restrict("admin"), update)
  .delete(restrict("admin"), remove);

export default router;
