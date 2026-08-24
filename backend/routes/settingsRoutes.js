import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// GET global settings (Public so the booking modal can see the QR)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    // If no settings exist yet, create an empty one automatically
    if (!settings) settings = await Settings.create({});
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update settings (Admin only ideally)
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    
    settings.qrCodeUrl = req.body.qrCodeUrl || settings.qrCodeUrl;
    await settings.save();
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;