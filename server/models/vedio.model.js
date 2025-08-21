import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  duration: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  views: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
});

// ✅ Indexes for performance
videoSchema.index({ likedBy: 1 });
videoSchema.index({ dislikedBy: 1 });
videoSchema.index({ description: 'text' });

export const Video = mongoose.model('Video', videoSchema);

