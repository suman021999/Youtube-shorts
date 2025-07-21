import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    duration: Number, // in seconds
    format: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export const Video = mongoose.model('Video', videoSchema);