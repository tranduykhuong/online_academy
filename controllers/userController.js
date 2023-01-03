import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
    favorite: catchAsync(async (req, res, next) => {
      res.render('vwFavorite/favorite', {
        layout: 'layout'
      })
    }),

    studentProfile: catchAsync(async (req, res, next) => {
      res.render('vwProfile/profile', {
        layout: 'layout'
      })
    }),

    // teacherProfile: catchAsync(async (req, res, next) => {
    //     res.render('vwTeacher/statistic', {
    //         layout: 'layout'
    //     })
    // }),
};
