import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
  addGrocery,
  getGroceries,
  updateGrocery,
  getSingleGrocery,
  deleteGrocery,
} from "../controllers/groceryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Routes for Grocery Management
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  addGrocery
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateGrocery
);

router.delete("/:id", protect, adminOnly, deleteGrocery);

// User Routes for Grocery Viewing
router.get("/:id", protect, getSingleGrocery);
router.get("/", protect, getGroceries);

export default router;