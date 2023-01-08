import express from 'express';

import authController from '../controllers/authController.js';
import authMdw from '../middlewares/auth.mdw.js';

const router = express.Router();

router.route('/signup') 
  .post(authController.signup);
router.route('/login') 
  .get(authController.login)
  .post(authController.login);

router.route('/updatePassword') 
  .get(authController.updatePassword);
router.route('/logout') 
  .get(authController.logout)

router.route('/verifyEmail') 
  .get(authController.verifyEmail);
router.route('/verifyOTP') 
  .get(authController.verifyOTP);

router.route('/register-teacher') 
  .get((req, res, next) => {
    res.render('auth/vwRegisterTeacher', {
      layout: 'layoutEmpty',
      path: req.session.returnUrl || '/auth'
    });
  })
  .post(authController.registerTeacher)

router.route('/')
  .get((req, res, next) => {
    res.render('auth/vwAuth', {
      layout: 'layoutEmpty',
      path: '/auth/signup?step=email',
      stepEmail: true
    });
  })


export default router;
