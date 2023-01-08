import express from 'express';
import courseController from '../controllers/courseController.js';

const router = express.Router();

router.route('/deletefeedback/:idfeedback').post(courseController.deletefeedback);
router.route('/:idcourse/createfeedback').post(courseController.createfeedback);
router.route('/:idcourse/addtofavorite/:flag').post(courseController.addtofavorite);
router.route('/:idcourse/buycourse/:flag').post(courseController.buycourse);
router.route('/:idcourse').get(courseController.courseDetail);

router.route('/') 
  .get(courseController.courses);

export default router;