//commentController.js
import {Router} from 'express';
import CommentController from '../controller/comment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
const commentController = new CommentController();

// Public routes
router.get('/video/:videoId', commentController.getCommentsByVideo);
router.get('/:commentId/replies', commentController.getReplies);

// Protected routes
router.route('/',).post( authenticate, commentController.createComment);
router.route('/:commentId',).put( authenticate, commentController.updateComment);
router.route('/:commentId',).delete( authenticate, commentController.deleteComment);
router.route('/:commentId/like',).post( authenticate, commentController.likeComment);
router.route('/:commentId/dislike').post( authenticate, commentController.dislikeComment);

export default router;