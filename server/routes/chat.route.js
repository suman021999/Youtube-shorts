// chat.route.js
import {Router} from 'express';
import {authMiddleware} from '../middleware/auth.middleware.js';

const router = Router();

// Store the controller reference
let chatController;

// Function to set the controller
export function setController(controller) {
  chatController = controller;
}

// Chat routes
router.route('/chats').post(authMiddleware, (req, res) => chatController.createChat(req, res));
router.route('/chats/:chatId').get(authMiddleware, (req, res) => chatController.getChat(req, res));
router.route('/chats').get(authMiddleware, (req, res) => chatController.getUserChats(req, res));
router.route('/chats/:chatId/read').patch(authMiddleware, (req, res) => chatController.markMessagesAsRead(req, res));

// Comment routes
router.route('/comments').post(authMiddleware, (req, res) => chatController.createComment(req, res));
router.route('/comments/video/:videoId').get((req, res) => chatController.getCommentsByVideo(req, res));
router.route('/comments/:commentId/replies').get((req, res) => chatController.getReplies(req, res));
router.route('/comments/:commentId').put(authMiddleware, (req, res) => chatController.updateComment(req, res));
router.route('/comments/:commentId').delete(authMiddleware, (req, res) => chatController.deleteComment(req, res));
router.route('/comments/:commentId/like').post(authMiddleware, (req, res) => chatController.likeComment(req, res));
router.route('/comments/:commentId/dislike').post(authMiddleware, (req, res) => chatController.dislikeComment(req, res));
router.route('/comments/:commentId/stats').get((req, res) => chatController.getCommentStats(req, res));

export const chatRouter = {
  router,
  setController
};