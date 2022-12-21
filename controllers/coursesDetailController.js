import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
    courseDetail: catchAsync(async (req, res, next) => {
      res.render('vwCourseDetail/courseDetail', {
        layout: 'layout'
      })
    }),
};
