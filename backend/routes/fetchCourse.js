const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();



router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    
    const simulatedCourse = {
      id: `custom-${Date.now()}`, 
      title: 'Custom Course from URL',
      description: 'Details fetched from the provided course URL.',
      provider: 'Custom Provider (Simulated)',
      url: url,
    };

    res.status(200).json(simulatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch course details' });
  }
});

module.exports = router;