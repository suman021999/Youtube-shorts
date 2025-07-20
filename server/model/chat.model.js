import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.isDeleted;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Indexes
chatSchema.index({ videoId: 1, timestamp: -1 });
chatSchema.index({ userId: 1, videoId: 1 });
chatSchema.index({ isDeleted: 1 });

// Virtuals
chatSchema.virtual('formattedTime').get(function() {
  return this.timestamp.toISOString();
});

// Hooks
chatSchema.pre('save', function(next) {
  if (this.isModified('likedBy')) {
    this.likes = this.likedBy.length;
  }
  if (this.isModified('dislikedBy')) {
    this.dislikes = this.dislikedBy.length;
  }
  next();
});

// Static Methods
chatSchema.statics.getPaginatedMessages = async function(videoId, page = 1, limit = 50) {
  return this.find({ videoId, isDeleted: false })
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'name avatar')
    .lean();
};

chatSchema.statics.handleReaction = async function(messageId, userId, action) {
  const update = {};
  const pull = {};
  
  if (action === 'like') {
    update.$addToSet = { likedBy: userId };
    pull.$pull = { dislikedBy: userId };
  } else if (action === 'dislike') {
    update.$addToSet = { dislikedBy: userId };
    pull.$pull = { likedBy: userId };
  } else if (action === 'removeLike') {
    update.$pull = { likedBy: userId };
  } else if (action === 'removeDislike') {
    update.$pull = { dislikedBy: userId };
  }

  return this.findByIdAndUpdate(
    messageId,
    [update, pull],
    { new: true }
  ).select('likes dislikes likedBy dislikedBy');
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;