import express from "express";
import {
  create,
  findAll,
  findOne,
  remove,
  update,
} from "../controllers/category.controller";
import restrict from "../guards/restrict.guard";

const router = express.Router();

router
  .route("/")
  .post(restrict("admin", "cashier"), create)
  .get(restrict("admin", "cashier"), findAll);

router
  .route("/:id")
  .get(restrict("admin", "cashier"), findOne)
  .put(restrict("admin", "cashier"), update)
  .patch(restrict("admin", "cashier"), update)
  .delete(restrict("admin"), remove);

export default router;
