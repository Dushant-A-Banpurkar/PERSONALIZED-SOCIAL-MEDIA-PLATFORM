import multer from 'multer';
import path from 'path';
import express,{Request,Response} from 'express'
import { saveMessage } from "../controller/message.Controller";
import { AuthenticatedRequest, protectRoute } from '../middleware/protectRoute';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.join(__dirname, '../../uploads'),
});

// Route for sending messages with optional attachments
router.post(
  '/send',
  protectRoute,
  upload.single('file'), // Handles the file upload
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { conversationId, sender, receiver, message } = req.body;

      // Check if there is an uploaded file
      let mediaUrl: string | null = null;
      let mediaType: 'image' | 'video' | 'audio' | 'document' | null = null;
      if (req.file) {
        // Define media URL and type based on file details
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype.startsWith('image')
          ? 'image'
          : req.file.mimetype.startsWith('video')
          ? 'video'
          : req.file.mimetype.startsWith('audio')
          ? 'audio'
          : 'document';
      }

      // Save the message with the attachment details if present
      const messages = await saveMessage({
        conversationId,
        sender,
        receiver,
        message,
        mediaUrl,
        mediaType,
      });

      res.status(201).json(messages);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
