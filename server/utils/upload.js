// // upload
// import multer from "multer";

// const storage = multer.memoryStorage();

// // Supported short video formats (focus on mobile-friendly formats)
// const supportedShortFormats = [
//     'video/mp4',       // MP4 is most widely supported
//     'video/quicktime', // For iOS devices
//     'video/webm'       // For smaller file sizes
// ];

// // Maximum duration for shorts (60 seconds in milliseconds)
// const MAX_SHORT_DURATION = 60 * 1000; 

// function fileFilter(req, file, cb) {
//     if (supportedShortFormats.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(
//             new Error(`Invalid file type (${file.mimetype}). Only short video files (${supportedShortFormats.join(', ')}) are allowed.`),
//             false
//         );
//     }
// }

// export const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 50 * 1024 * 1024, // 50MB (smaller than regular videos)
//         //files: 1 // Only allow one file
//     }
// });







// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

const supportedVideoFormats = [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo', // AVI
    'video/x-matroska' // MKV
];

const fileFilter = (req, file, cb) => {
    if (supportedVideoFormats.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}. Supported types: ${supportedVideoFormats.join(', ')}`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});

export { upload };