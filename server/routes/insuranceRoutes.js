import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getInsuranceInfo, updateInsuranceInfo } from "../controllers/insuranceController.js";

const router = Router();

router.get("/me", authMiddleware, getInsuranceInfo);
router.post("/update", authMiddleware, updateInsuranceInfo); // To add or update insurance info

export default router;
