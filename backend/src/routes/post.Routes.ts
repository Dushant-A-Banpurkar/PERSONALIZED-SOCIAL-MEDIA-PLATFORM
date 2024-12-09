import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  createPost,
  deletePost,
  commentOnPost,
  getLikedPost,
  likeUnlikePost,
  getAllPosts,
  followPosts,
  getUserPosts
} from "../controller/post.controller";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, followPosts);
router.get("/user/:username",protectRoute,getUserPosts)
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.get("/likes/:id", protectRoute, getLikedPost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;