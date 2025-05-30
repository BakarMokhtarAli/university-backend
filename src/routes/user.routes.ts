import express from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/protect";

const router = express.Router();

router.get("/", protect, restrictTo("admin"), getAllUsers);
// router.get("/:id", protect, getUserById);

export default router;
