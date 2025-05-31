import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/protect";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
// router.get("/:id", protect, getUserById);

export default router;
