import express from "express";
import restrict from "../guards/restrict.guard";
import {
  create,
  findAll,
  findOne,
  checkStock,
  addPayment,
} from "../controllers/sale.controller";

const router = express.Router();

router
  .route("/")
  .post(restrict("admin", "cashier"), create)
  .get(restrict("admin", "cashier"), findAll);

router.route("/find/:id").get(restrict("admin", "cashier"), findOne);

router.get("/checkStock", restrict("admin", "cashier"), checkStock);
router.patch("/addPayment/:id", restrict("admin", "cashier"), addPayment);

export default router;
