import express from 'express';
import { 
  getCars, 
  createCar, 
  getCarById, 
  updateCarStatus, 
  deleteCar, 
  updateCar 
} from '../controllers/carController.js';

const router = express.Router();

router.get('/', getCars); 
router.post('/', createCar); 
router.get('/:id', getCarById); 
router.patch('/:id/status', updateCarStatus); 
router.delete('/:id', deleteCar); 
router.put('/:id', updateCar); 

export default router;