import { Router } from "express";
import { sendSOSAlert } from "../controllers/sosController.js";

const router = Router();


router.post("/", (req, res, next) => {
  console.log("🚀 Incoming SOS Request:", req.body);
  next();
}, sendSOSAlert);

export default router;
