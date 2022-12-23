import express from 'express';
import favoriteController from '../controllers/favoriteController.js';

const router = express.Router();

router.route('/') 
  .get(favoriteController.favorite);

export default router;