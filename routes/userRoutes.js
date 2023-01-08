import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.route('/favorite') 
  .get(userController.favorite);

router.route('/mycourse') 
  .get(userController.mycourse);

router.route('/')
  .get(userController.studentProfile);

export default router;