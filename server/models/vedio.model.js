// // models/video.model.js
// import mongoose from 'mongoose';

// const videoSchema = new mongoose.Schema({
//     description: {
//         type: String,
//         trim: true,
//         maxlength: 500
//     },
//     videoUrl: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true
//     },
//     duration: {
//         type: Number,
//         required: true
//     },
//     format: {
//         type: String,
//         required: true
//     },
//     likes:{
//         type: Number,
//         required: true,
//     },
//     dislike:{
//         type: Number,
//         required: true,
//     },
//     views:{
//         type: Number,
//         required: true,
//     },
//     share:{
//         type: Number,
//         required: true,
//     },
//     owner: {
//         type:mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
// }, {
//     timestamps: true
// });

// // Add text index for search functionality
// videoSchema.index({ description: 'text',  });

// export const Video = mongoose.model('Video', videoSchema);



  // models/video.model.js
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
// Index for better performance
videoSchema.index({ likedBy: 1 });
videoSchema.index({ dislikedBy: 1 });
videoSchema.index({ description: 'text' });

export const Video = mongoose.model('Video', videoSchema);
