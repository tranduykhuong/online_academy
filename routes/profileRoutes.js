import express from 'express';
import profileController from '../controllers/profileController.js';

const router = express.Router();

router.route('/') 
  .get(profileController.student);

export default router;