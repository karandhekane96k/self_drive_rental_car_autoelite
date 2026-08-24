import path from 'path';
import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// 1. Ensure the 'uploads' folder exists on your computer
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. Configure where and how the file is saved
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Rename the file to prevent duplicates (e.g., car-169283726.jpg)
    cb(null, `car-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// 3. The actual route that catches the file
router.post('/', upload.single('image'), (req, res) => {
  const fullUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.send({
    message: 'Image Uploaded Successfully',
    image: fullUrl,
    imageUrl: fullUrl // Added so both frontend key checks pass successfully
  });
});

export default router;