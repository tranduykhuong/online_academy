import express from 'express';
import coursesDetailController from '../controllers/coursesDetailController.js';

const router = express.Router();

router.route('/') 
  .get(coursesDetailController.courseDetail);

export default router;