import express from 'express';
import courseController from '../controllers/courseController.js';

const router = express.Router();

router.route('/:idCourse') 
  .get(courseController.courseDetail);

router.route('/') 
  .get(courseController.courses);

export default router;