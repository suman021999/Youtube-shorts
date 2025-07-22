import multer from "multer";
// import { v4 as uuidv4 } from 'uuid';

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (
    file.mimetype.startsWith("vedio/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(`Invalid file type (${file.mimetype}). Only vedio files are allowed.`),
      false
    );
  }
}

export const upload = multer({
  storage,
  fileFilter,
 limits: {
        fileSize: 100 * 1024 * 1024 
    }
});
