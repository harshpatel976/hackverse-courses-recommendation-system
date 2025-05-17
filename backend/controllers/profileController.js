const UserProfile = require('../models/Userprofile');

// GET /api/profile - Fetch user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};