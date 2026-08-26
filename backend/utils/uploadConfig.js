import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Log in to Cloudinary using your .env passwords
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Tell Multer to send files straight to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nandi_cars_fleet', // This will create a neat folder in your Cloudinary dashboard
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// 3. Export the final middleware 
export const upload = multer({ storage });