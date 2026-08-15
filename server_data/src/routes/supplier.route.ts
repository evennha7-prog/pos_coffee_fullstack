import express from "express";
import {
  create,
  findAll,
  findOne,
  remove,
  update,
} from "../controllers/supplier.controller";
import restrict from "../guards/restrict.guard";

const router = express.Router();

router
  .route("/")
  .post(restrict("admin"), create)
  .get(restrict("admin", "cashier"), findAll);

router
  .route("/:id")
  .get(restrict("admin", "cashier"), findOne)
  .patch(restrict("admin"), update)
  .delete(restrict("admin"), remove);

export default router;
