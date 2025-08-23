
// middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage();

const supportedVideoFormats = [
    'video/mp4',       // MP4 is most widely supported
    'video/quicktime', // For iOS devices
    'video/webm'       // For smaller file sizes

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