import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import viewVideoController from '../controllers/viewVideoController.js';

const router = express.Router();

router.route('/')
.get(viewVideoController.video);

export default router;