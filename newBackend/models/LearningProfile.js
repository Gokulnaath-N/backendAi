const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    // Optional as per requirements, but good to have
  },
  learningLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false }); // Disable _id for embedded subdocuments if not needed, but usually good to keep. Detailed req didn't specify, will keep default behavior or disable if strict. Let's keep default _id for courses as it's useful.

const learningProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  graduationYear: {
    type: Number,
  },
  studyType: {
    type: String,
    enum: ['UG', 'PG', 'Lifetime'],
  },
  courses: [courseSchema]
}, { timestamps: true });

module.exports = mongoose.model('LearningProfile', learningProfileSchema);
