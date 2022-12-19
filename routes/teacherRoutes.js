import express from 'express';
import bcrypt from 'bcryptjs';

import teacherController from '../controllers/teacherController.js';

const router = express.Router();

router.route('/addCourse/:id')
.get(teacherController.addCourse);

router.route('/home')
.get(teacherController.home);

router.route('/statistic')
.get(teacherController.statistic);

export default router;
