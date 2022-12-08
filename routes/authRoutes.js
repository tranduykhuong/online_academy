import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment';

import authController from '../controllers/authController.js';

const router = express.Router();

router.route('/signup')
  .get((req, res, next) => {
    res.render('auth/signup');
  })
  .post(authController.signup)
  .delete()

router.route('/login')
  .get((req, res, next) => {
    res.render('auth/login');
  })

export default router;