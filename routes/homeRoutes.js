import express from 'express';
import homeController from '../controllers/homeController.js';

const router = express.Router();

router.route('/') 
  .get(homeController.home);

export default router;