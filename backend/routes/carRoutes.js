import express from 'express';
import { 
  getCars, 
  createCar, 
  getCarById, 
  updateCarStatus, 
  deleteCar, 
  updateCar 
} from '../controllers/carController.js';

// 1. Import your new Cloudinary upload middleware!
import { upload } from '../utils/uploadConfig.js'; 

const router = express.Router();

router.get('/', getCars); 

// 2. Add upload.single('image') to intercept the photo before creating the car
router.post('/', upload.single('image'), createCar); 

router.get('/:id', getCarById); 
router.patch('/:id/status', updateCarStatus); 
router.delete('/:id', deleteCar); 

// 3. Add upload.single('image') here as well in case you update a car's photo later
router.put('/:id', upload.single('image'), updateCar); 

export default router;