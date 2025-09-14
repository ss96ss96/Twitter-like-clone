import express from "express";
import {
  getPosts,
  createPost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, createPost);
router.delete("/:id", protect, deletePost);

export default router;
