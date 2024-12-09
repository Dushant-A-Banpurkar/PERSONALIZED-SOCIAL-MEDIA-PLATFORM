import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  deleteNotifications,
  getNotifications
} from "../controller/notification.controller";
const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);


export default router;