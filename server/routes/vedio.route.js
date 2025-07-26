import express from 'express';
import { uploadVideo, getAllVideo, getAllVideos,  getSingleVideo} from '../controller/Vedio.controller.js';
import { authMiddleware} from '../middleware/auth.middleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

// Video routes
router.route('/upload').post(authMiddleware, upload.single('video'), uploadVideo) 

router.route('/').get(authMiddleware,getAllVideo);

router.route('/all').get(authMiddleware,getAllVideos);
router.route('/:id').get( getSingleVideo);



export default router;


