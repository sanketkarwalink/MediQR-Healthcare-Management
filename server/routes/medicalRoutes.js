import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMedicalInfo, getMedicalQR, getMedicalInfoByQR, updateMedicalInfo } from "../controllers/medicalController.js";

const router = Router();

router.get("/me", authMiddleware, getMedicalInfo);

router.post("/add", authMiddleware, updateMedicalInfo);

router.put("/edit", authMiddleware, updateMedicalInfo);

router.get("/qr", authMiddleware, getMedicalQR);

router.get("/qr-result/:userId", getMedicalInfoByQR);

export default router;


