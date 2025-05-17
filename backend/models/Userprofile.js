const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  biodata: {
    fullName: { type: String, required: true },
    age: { type: Number, min: 1 },
    occupation: { type: String },
    location: { type: String },
  },
  skillSet: [
    {
      skill: { type: String, required: true },
      proficiency: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
      },
    },
  ],
  interests: [{ type: String }],
  goalSet: [
    {
      goal: { type: String, required: true },
      targetDate: { type: Date },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
    },
  ],
   enrolledCourses: [
    {
      courseId: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      enrolledAt: { type: Date, default: Date.now },
    },
  ],
  timeAvailability: {
    hoursPerWeek: { type: Number, min: 0, default: 0 },
    preferredDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    preferredTimeSlots: [{ type: String }], // e.g., "9:00-11:00 AM"
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
quizProgress: [
    {
      courseId: { type: String, required: true },
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
  
// Update timestamp on save
userProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);