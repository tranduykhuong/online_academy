import express from 'express';

import authController from '../controllers/authController.js';

const router = express.Router();

router.route('/signup')
  .get((req, res, next) => {
    res.render('auth/signup');
  })
  .post(authController.signup)
  .delete()

router.route('/login') 
  .get(authController.login);

export default router;
