import express from 'express';
import { upload } from '../utils/uploadConfig.js';

const router = express.Router();

// Upload image directly to Cloudinary
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Cloudinary automatically attaches the permanent cloud URL to req.file.path
    const fullUrl = req.file.path;

    res.status(200).send({
      message: 'Image Uploaded Successfully',
      image: fullUrl,
      imageUrl: fullUrl, // Keeps both keys compatible with your frontend
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

export default router;