import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import courseController from '../controllers/courseController.js';

const router = express.Router();

router.route('/:idCourse')
.get(courseController.viewVideo);



export default router;