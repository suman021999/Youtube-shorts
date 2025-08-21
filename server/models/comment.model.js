// models/Comment.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  videoId: {
    type: Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
    likedBy: [{   
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikedBy: [{ 
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search functionality
commentSchema.index({ text: 'text' });

const Comment = model('Comment', commentSchema);

export default Comment;