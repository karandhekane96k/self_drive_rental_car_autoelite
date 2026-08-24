import express from 'express';
// We added authUser to our imports
import { registerUser, authUser } from '../controllers/userController.js'; 

const router = express.Router();

// Route for Registration: POST /api/users
router.post('/', registerUser);

// NEW Route for Login: POST /api/users/login
router.post('/login', authUser);

export default router;