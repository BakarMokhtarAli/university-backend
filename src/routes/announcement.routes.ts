import express from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";
import { protect } from "../middleware/protect";

const router = express.Router();

router.use(protect); // Protect all routes

// GET all announcements and POST a new one
router.route("/").get(getAllAnnouncements).post(createAnnouncement);

// GET one, UPDATE, DELETE by ID
router
  .route("/:id")
  .get(getAnnouncementById)
  .patch(updateAnnouncement)
  .delete(deleteAnnouncement);

export default router;
