import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
    student: catchAsync(async (req, res, next) => {
      res.render('vwProfile/profile', {
        layout: 'layout'
      })
    }),

    // teacher: catchAsync(async (req, res, next) => {
    //     res.render('vwTeacher/statistic', {
    //         layout: 'layout'
    //     })
    // }),
};
