import express from 'express';
import bcrypt from 'bcryptjs';

import courseController from '../controllers/courseController.js';
import localMdw from '../middlewares/upload.mdw.js';
import authMdw from '../middlewares/auth.mdw.js';
import userController from '../controllers/userController.js';

const router = express.Router();


router.route('/addCourse/addChapter')
.get(courseController.addChapter)
router.route('/addCourse/addLession')
.get(courseController.addLession)
router.route('/addCourse/completeCourse')
.get(courseController.completeCourse)
router.route('/addCourse/submitCourse')
.get(courseController.submitCourse)

router.use(authMdw.protect, authMdw.restrictTo('teacher'))

router.route('/addCourse/:idCourse')
.get(courseController.addCourse)
.post(
  localMdw.uploadMdw,
  courseController.addCourse);

router.route('/addCourse')
  .get(courseController.addCourse)
  .post(
    localMdw.uploadMdw,
    courseController.addCourse);

router.route('/home')
.get(courseController.home);
router.route('/profile')
.get(userController.show);
router.route('/profile/password')
.put(userController.changePassword);
router.route('/profile').put(
  localMdw.uploadAvtMdw,
  userController.update
);

router.route('/detail/:id')
.get(courseController.detailCourse)

router.route('/statistic')
.get(courseController.statistic);

router.route('/')
.get((req, res, next) => {
  res.redirect('/teacher/home')
});

export default router;
