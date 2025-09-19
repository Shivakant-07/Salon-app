import express from "express";
import { getStaff, addStaff, deleteStaff, updateStaff } from "../controllers/staffController.js";

const router = express.Router();

// @route   GET /api/staff
// @desc    Get all staff
router.get("/", getStaff);

// @route   POST /api/staff
// @desc    Add new staff (name + email + skills + availability)
router.post("/", addStaff);

// @route   DELETE /api/staff/:id
// @desc    Delete staff
router.delete("/:id", deleteStaff);

// @route   PUT /api/staff/:id
// @desc    Update staff
router.put("/:id", updateStaff);


export default router;
