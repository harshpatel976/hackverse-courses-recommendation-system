const UserProfile = require('../models/Userprofile');

class ProfileService {

  static async upsertProfile(userId, profileData) {
    try {
      const { biodata, skillSet, interests, goalSet, timeAvailability } = profileData;

      
      if (!biodata?.fullName || !skillSet?.length || !goalSet?.length) {
        throw new Error('Full name, at least one skill, and one goal are required');
      }

    
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        {
          biodata,
          skillSet,
          interests,
          goalSet,
          timeAvailability,
          updatedAt: Date.now(),
        },
        { new: true, upsert: true, runValidators: true }
      );

      return profile;
    } catch (error) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  }

 
  static async getProfile(userId) {
    try {
      const profile = await UserProfile.findOne({ userId }).populate('userId', 'email');
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    } catch (error) {
      throw new Error(`Failed to retrieve profile: ${error.message}`);
    }
  }
}

module.exports = ProfileService;