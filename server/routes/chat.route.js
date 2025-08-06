import {Router} from 'express';
// import ChatController from '../controller/chat.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();
let chatController = null;

// This allows us to set the controller after instantiation
export const setController = (controller) => {
  chatController = controller;
};

// Protected routes
router.route('/').post( authenticate, (req, res) => chatController.createChat(req, res));
router.route('/user').get( authenticate, (req, res) => chatController.getUserChats(req, res));
router.route('/:chatId').get( authenticate, (req, res) => chatController.getChat(req, res));
router.route('/:chatId/read').post( authenticate, (req, res) => chatController.markMessagesAsRead(req, res));

export default { router, setController };

