const LearningProfile = require('../models/LearningProfile');

// Get profile by userId
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await LearningProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create or Update Profile
exports.upsertProfile = async (req, res) => {
  try {
    const { graduationYear, studyType, courses } = req.body;
    const userId = req.body.userId || req.body.userID;

    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    // Build update object
    const updateData = {};
    if (graduationYear) updateData.graduationYear = graduationYear;
    if (studyType) updateData.studyType = studyType;
    if (courses) updateData.courses = courses; // Replaces courses array. logic can be adjusted to $push if needed, but upsert usually implies setting state.

    const profile = await LearningProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Upsert Profile Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation Error: ${error.message}` });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid Data Type: ${error.message}` });
    }
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};
