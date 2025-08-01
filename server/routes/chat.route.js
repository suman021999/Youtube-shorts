import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// This will be injected from server initialization
let chatController = null;

// Middleware to ensure controller is initialized
const checkController = (req, res, next) => {
  if (!chatController) {
    return res.status(500).json({ error: "Chat system not initialized" });
  }
  req.chatController = chatController;
  next();
};

// Video Chat Routes
router.route('/:videoId/history')
  .get(protect, checkController, (req, res) => req.chatController.getChatHistory(req, res));

router.route('/:videoId/messages/:messageId/like')
  .post(protect, checkController, (req, res) => req.chatController.likeMessage(req, res));

router.route('/:videoId/messages/:messageId/dislike')
  .post(protect, checkController, (req, res) => req.chatController.dislikeMessage(req, res));

router.route('/:videoId/active-users')
  .get(protect, checkController, (req, res) => req.chatController.getActiveUsers(req, res));

// Export mechanism
export default {
  router,
  setController: (controller) => {
    chatController = controller;
  }
};



// ------------------------?

