import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import {
  sendMessage,
  getMessages,
} from "../controller/message.Controller";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4|mov/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos, and documents are allowed!"));
    }
  },
});

// Route to create a new message
router.post("/send/:id", protectRoute, upload.single("file"), (req, res) => {
  sendMessage(req, res, req.app.get('io')); // Pass io to the function
});


// Route to get messages by conversationId


// Route to get or create a conversation with a specific user
router.get("/:id", protectRoute, getMessages);

export default router;
