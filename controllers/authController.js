import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import Email from '../utils/Email.js';

import User from '../models/user.model.js';
import TeacherForm from '../models/teacher-form.model.js';

const cookieOptions = {
 expires: new Date(Date.now() + 90000000),
 httpOnly: true,
 sameSite: 'None',
 secure: true,
};

const signToken = (email) => jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

export default {
 signup: catchAsync(async (req, res, next) => {
  const step = req.query.step;
  const cookies = req?.cookies;

  if (step === 'email') {
   req.session.email = req.body.email;

   res.render('auth/vwAuth', {
    layout: 'layoutEmpty',
    path: '/auth/signup?step=otp',
    stepOtp: true,
   });
  } else if (step === 'otp') {
   res.render('auth/vwAuth', {
    layout: 'layoutEmpty',
    path: '/auth/signup?step=password',
    stepPassword: true,
   });
  } else if (step === 'password') {
   try {
    const user = await User.create({
     name: req.body.name,
     email: req.session.email,
     password: req.body.password,
    });

<<<<<<< HEAD
    req.session.user = user;

    if (cookies?.jwt) {
     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    }

    const token = signToken(user.email);
    console.log(token);
    res.cookie('jwt', token, cookieOptions);

    const url = req.session.returnUrl || '/';
    res.redirect(url);
   } catch (err) {
    console.log(err);
    res.redirect('/auth');
   }
  }
 }),

 verifyEmail: catchAsync(async (req, res, next) => {
  const email = req.query.email;

  const user = await User.findOne({ email: email });

  if (user) {
   return res.json(false);
  }

  let otp = '';
  for (let i = 0; i < 6; i++) {
   otp += parseInt(Math.random() * 10);
  }
  console.log(otp);

  // Gửi email
  try {
    await new Email(email).sendOTP(otp);
    console.log('email success')
  } catch (err) {
    console.log(err);
  }

  // Mã hóa OTP
  req.session.otp = jwt.sign({ otp }, process.env.OTP_TOKEN_SECRET, { expiresIn: '60s' });

  return res.json(true);
 }),

 verifyOTP: catchAsync(async (req, res, next) => {
  const otp = req.query.otp;

  const decodedOtp = await promisify(jwt.verify)(req.session.otp, process.env.OTP_TOKEN_SECRET);

  if (decodedOtp.otp === otp) {
   req.query.otp = undefined;
   return res.json(true);
  }

  return res.json(false);
 }),

 login: catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const cookies = req?.cookies;

  if (req.method == 'GET') {
    res.render('auth/vwAuth', {
      layout: 'layoutEmpty',
      login: true,
      stepEmail: true
     });
     return;
  }

  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    res.render('auth/vwAuth', {
      layout: 'layoutEmpty',
      login: true,
      email,
      failed: true,
     });
     return;
  }

  req.session.user = user;

  if (cookies?.jwt) {
   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  }

  const token = signToken(user.email);
  res.cookie('jwt', token, cookieOptions);

  if (user.role === 'admin') {
    return res.redirect('/admin');
  } else if (user.role === 'teacher') {
    return res.redirect('/teacher')
  } else if (user.role === 'student') {
    return res.redirect(req.session.returnUrl || '/');
  }
  res.redirect('/')
 }),

 logout: catchAsync(async (req, res, next) => {
  const cookies = req?.cookies;

  req.session.user = null;

  if (cookies?.jwt) {
   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  }

  const url = req.session.returnUrl || '/';
  res.redirect(url);
 }),

 isValidPassword: catchAsync(async (req, res, next) => {
  const { oldPassword } = req.body;

  const email = req.session.user.email;
  try {
    const user = await User.findOne({email});
    if (user && user.correctPassword(oldPassword, user.password)) {
      return res.json(true);
    }
  } catch (error) {
    console.log(error);
  } finally {
    res.json(false);
  }
  res.json(false);
 }),

 updatePassword: catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;

  const email = req.session.user.email;
  try {
    await User.findByIdAndUpdate({email}, {
      password: newPassword
    })
  } catch (error) {
    console.log(error);
  }

  const url = req.session.returnUrl || '/';
  res.redirect(url);
 }),

 registerTeacher: catchAsync(async (req, res, next) => {
  const data = req.body;

  try {
    await TeacherForm.create(data);
  } catch (error) {
    return res.render('auth/vwRegisterTeacher', {
      layout: 'layoutEmpty',
      failed: true,
      name: data.name,
      email: data.email,
      where: data.where,
      description: data.description,
      experience: data.experience,
      path: req.headers.referer || '/'
     });
  }

  res.render('auth/vwRegisterTeacher', {
    layout: 'layoutEmpty',
    success: true,
    path: req.headers.referer || '/'
   });
 }),
};
=======
  login: catchAsync(async (req, res, next) => {
    res.render('auth/login', {
      layout: 'layoutEmpty'
    })
  })
}
>>>>>>> 5be8012 (merge final)
