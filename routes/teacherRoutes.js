import express from 'express';
import bcrypt from 'bcryptjs';

import courseController from '../controllers/courseController.js';
import localMdw from '../middlewares/locals.mdw.js';

const router = express.Router();

<<<<<<< HEAD
router.route('/addCourse/:id')
    .get(teacherController.addCourse);

router.route('/home')
    .get(teacherController.home);

router.route('/statistic')
    .get(teacherController.statistic);
=======
router.route('/addCourse/addChapter')
.get(courseController.addChapter)
router.route('/addCourse/addLession')
.get(courseController.addLession)
router.route('/addCourse/completeCourse')
.get(courseController.completeCourse)
router.route('/addCourse/submitCourse/:user')
.get(courseController.submitCourse)

router.route('/addCourse')
.get(courseController.addCourse)
.post(
  localMdw.uploadMdw,
  courseController.addCourse);

router.route('/home')
.get(courseController.home);

router.route('/statistic')
.get(courseController.statistic);
>>>>>>> 94d6c2cc1a5d150d6af7db9b32632f0fe6fe66a4

export default router;
