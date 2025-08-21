import express from 'express';
import { uploadVideo,getSingleVideo,  getAllVideos, getAllUserVideos, getRandomVideo, likeVideo, dislikeVideo, searchVideos } from '../controllers/Vedio.controller.js';
import { authMiddleware} from '../middleware/auth.middleware.js';
import { upload } from '../utils/upload.js';



const router = express.Router();

// Video routes
router.route('/upload').post(authMiddleware, upload.single('video'), uploadVideo) 

router.route('/user/:ownerID').get(authMiddleware,getAllUserVideos);

router.route('/search').get(authMiddleware, searchVideos);
router.route("/:videoId/like").post( authMiddleware, likeVideo);
router.route("/:videoId/dislike").post( authMiddleware, dislikeVideo);

router.route('/all').get(authMiddleware,getAllVideos);
router.route('/random').get(getRandomVideo);
router.route('/:id').get( getSingleVideo);

export default router;



