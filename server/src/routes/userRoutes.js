import express from "express";
import { getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { toggleFollow } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserProfile);
router.post("/:id/follow", protect, toggleFollow);
//protect middleware to ensure only logged in users can follow/unfollow

export default router;
