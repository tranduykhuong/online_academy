import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import User from '../models/user.model.js';

export default {
  protect: catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      res.locals.user = undefined;
      req.session.returnUrl = req.originalUrl;
      res.redirect('/auth/login')
      console.log('No token');
      return;
    }
  
    // 2) Varification token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          req.session.returnUrl = req.originalUrl;
          res.redirect('/auth/login')
          console.log('Espirise token');
           return;
        }
  
        // 3) Check user still exists
        const currentUser = await User.findOne({email: decoded.email});
        if (!currentUser) {
          req.session.returnUrl = req.originalUrl;
          res.redirect('/auth')
          console.log('No user');
           return;
        }
  
        // GRANT ACCESS TO PROTECTED ROUTE
        req.session.user = currentUser;
        next();
      }
    )
  }),

  restrictTo:
    (...roles) =>
      (req, res, next) => {
        // roles ['admin']. role='user'
        if (!roles.includes(req.session.user.role)) {
          if (req.session.user.role === 'student') {
            res.redirect('/')
          } else if (req.session.user.role === 'admin') {
            res.redirect('/admin')
          } else if (req.session.user.role === 'teacher') {
            res.redirect('/teacher')
          }
          return;
        }
  
      next();
    }
}

