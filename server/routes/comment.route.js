// routes/comments.js
import {Router} from 'express';
import  { createComment, deleteComment, dislikeComment, getComments, likeComment,  updateComment } from '../controllers/comment.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = Router();
// Public routes
router.get('/:videoId', getComments);


// Protected routes (require authentication)
router.post('/', authMiddleware, createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);
router.post('/like/:id', authMiddleware, likeComment);
router.post('/dislike/:id', authMiddleware, dislikeComment);

export default router;