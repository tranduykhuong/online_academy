import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';

export default {
    addCourse: catchAsync(async (req, res, next) => {
        const step = parseInt(req.params.id);

        switch (step) {
            case 1:
                res.render('vwTeacher/addCourse', {
                    layout: null,
                    step1: true,
                });
                break;
            case 2:
                res.render('vwTeacher/addCourse', {
                    layout: null,
                    step2: true,
                });
                break;
            case 3:
                res.render('vwTeacher/addCourse', {
                    layout: null,
                    step3: true,
                });
                break;
            case 4:
                res.render('vwTeacher/addCourse', {
                    layout: null,
                    step4: true,
                });
                break;
            case 5:
                res.render('vwTeacher/addCourse', {
                    layout: null,
                    step5: true,
                });
                break;

            default:
                break;
        }
    }),

    home: catchAsync(async (req, res, next) => {
      res.render('vwTeacher/homeTeacher', {
        layout: 'teacherLayout'
      })
    }),

    statistic: catchAsync(async (req, res, next) => {
        res.render('vwTeacher/statistic', {
            layout: 'teacherLayout'
        })
    }),
};
