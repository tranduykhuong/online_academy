import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import userModel from '../models/user.model.js';
import courseModel from '../models/course.model.js';
import mongoose from '../utils/mongoose.js';

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

    mycourse: catchAsync(async (req, res, next) => {
      var buyCrs;
      var finalBuy = [];
      await userModel.findOne({ _id : '63af99d9bbc55b73d3b1761c'}).then(user =>{
        buyCrs = user.boughtCourses;
      })
      for(var i = 0; i < buyCrs.length; i++)
      {
        var currentChapter = buyCrs[i].idChapter;
        var currentLession = buyCrs[i].idLesson;
        await courseModel.findOne({ _id: buyCrs[i].idCourse}).then(course =>{
          var flagSeen = false;

          for(var j = 0; j < course.listChapter.length; j++)
          {
            var tmp = course.listChapter[j]._id;
            if(tmp.toString() === currentChapter.toString()) //Đã xem tới chương này rồi
            {
              for(var m = 0; m < course.listChapter[j].listVideo.length; m++)
              {
                var tmp1 = course.listChapter[j].listVideo[m]._id;
                if(tmp1.toString() === currentLession.toString())
                {
                  if(m == course.listChapter[j].listVideo.length - 1){
                    flagSeen = true;
                  }
                }
              }
            }
          }
          var object = {
            _id: course._id,
            name: course.name,
            description: course.description,
            image: course.image,
            createdBy: course.createdBy,
            price: course.price,
            ratingsAverage: course.ratingsAverage,
            author: course.createdBy.name,
            nbstudent: course.studentList.length,
            category: course.field.category.name,
            flagSaw: flagSeen
          }
          finalBuy.push(object);
        });
      }

      res.render('vwMyCourses/mycourse', {
        layout: 'layout',
        boughtCourses:  finalBuy,
        listcategory: req.session.entries
      })
    }),

    // teacherProfile: catchAsync(async (req, res, next) => {
    //     res.render('vwTeacher/statistic', {
    //         layout: 'layout'
    //     })
    // }),
};
