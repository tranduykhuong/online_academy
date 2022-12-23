import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js'
import AppError from './../utils/appError.js';

export default {
  signup: catchAsync(async (req, res, next) => {
    console.log('signup');
    // handle signup

    return next(new AppError(
      'This is a error.', 
      400
    ))

    res.render('auth/signup', {
      data: {}
    });
  }),

  login: catchAsync(async (req, res, next) => {
    res.render('auth/login', {
      layout: 'layoutEmpty'
    })
  })
}