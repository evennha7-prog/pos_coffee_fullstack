import express from "express";
import restrict from "../guards/restrict.guard";
import {
  create,
  findAll,
  findOne,
  updatePurchaseStatus,
  addPayment,
} from "../controllers/purchase.controller";

const router = express.Router();

router
  .route("/")
  .post(restrict("admin"), create)
  .get(restrict("admin"), findAll);

router.route("/:id").get(restrict("admin"), findOne);

router.patch(
  "/updatePurchaseStatus/:id",
  restrict("admin"),
  updatePurchaseStatus
);
router.patch("/addPayment/:id", restrict("admin"), addPayment);

export default router;
