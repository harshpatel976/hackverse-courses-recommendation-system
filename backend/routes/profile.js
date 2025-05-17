const express = require('express');
const router = express.Router();
const ProfileService = require('../services/profileServices');
const authMiddleware = require('../middlewares/auth');


router.post('/', authMiddleware, async (req, res) => {
  try {
    const profile = await ProfileService.upsertProfile(req.user.userId, req.body);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await ProfileService.getProfile(req.user.userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;