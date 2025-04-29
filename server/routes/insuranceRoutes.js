import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // Make sure this is checking the token
import { getInsuranceInfo, updateInsuranceInfo } from "../controllers/insuranceController.js";

const router = Router();

router.get("/me", authMiddleware, getInsuranceInfo); // Similar to medical info "me" route
router.post("/update", authMiddleware, updateInsuranceInfo); // To add or update insurance info

export default router;
