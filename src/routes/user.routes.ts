import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect, restrictTo } from "../middleware/protect";
import upload from "../middleware/upload";
import { imageUpload } from "../middleware/imageUpload.middleware";

const router = express.Router();

// router.use(protect);
// router.use(restrictTo("admin"));

router.route("/").get(getAllUsers).post(upload.single("image"), createUser);
router
  .route("/:id")
  .get(getUserById)
  .patch(upload.single("image"), updateUser)
  .delete(deleteUser);

// router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);
// router.get("/:id", protect, getUserById);

export default router;
