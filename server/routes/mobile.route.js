// routes/phoneRoutes.js
import express from "express";
import {
  addPhone,
  deletePhone,
  getPhones,
  getPhonesMeta,
  updatePhoneQuantity,
} from "../controller/mobile.controller.js";

const router = express.Router();

router.get("/meta", getPhonesMeta);
router.post("/add-phone", addPhone);
router.delete("/:id", deletePhone);
router.patch("/:id/quantity", updatePhoneQuantity);
router.get("/", getPhones);

export default router;
