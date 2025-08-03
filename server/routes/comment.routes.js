// comment.routes.js
import { Router } from 'express';
import {CommentController} from '../controller/comment.controller.js';
import {authMiddleware} from '../middleware/auth.middleware.js';

const router =Router();
const commentController = new CommentController();

// Base route
router.route('/')
  .post(authMiddleware, commentController.create);

// Video comments
router.route('/video/:videoId')
  .get(commentController.list);

// Specific comment operations
router.route('/:commentId')
  .get(commentController.show)
  .put(authMiddleware, commentController.update)
  .delete(authMiddleware, commentController.destroy);

// Like/Dislike
router.route('/:commentId/like')
  .post(authMiddleware, commentController.like);

router.route('/:commentId/dislike')
  .post(authMiddleware, commentController.dislike);

export default router;