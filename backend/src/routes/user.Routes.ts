import express from 'express';
import multer from 'multer';
import { protectRoute } from '../middleware/protectRoute';

import { getUserProfile, followUnfollowUser, getSuggestedProfile, updateUser, searchUsers, getFollowingUsers } from '../controller/user.controller';

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Filename with timestamp
  }
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50 MB size limit for uploads

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedProfile);
router.post('/follow/:id', protectRoute, followUnfollowUser);

// Update user route with file upload handling
router.post('/update', protectRoute, upload.single('image'), updateUser); // Assuming the file field is 'image'

router.get('/search', protectRoute, searchUsers);
router.get('/following', protectRoute, getFollowingUsers);

export default router;
