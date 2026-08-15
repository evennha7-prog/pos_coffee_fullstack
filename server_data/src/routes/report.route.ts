import express from "express";
import {
  generalReport,
  saleReport,
  stockReport,
  salereportIn30Days,
} from "../controllers/report.controller";
import restrict from "../guards/restrict.guard";

const router = express.Router();

router.get("/general", restrict("admin"), generalReport);
router.get("/sale", restrict("admin"), saleReport);
router.get("/stock", restrict("admin"), stockReport);
router.get("/30daysAgo", restrict("admin"), salereportIn30Days);

export default router;
