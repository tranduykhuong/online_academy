import { Error, Schema } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import UserSchema from '../models/user.model.js';
import mongooseFeature from '../utils/mongoose.js';
import CourseSchema from '../models/course.model.js';
import fs from 'fs';
import userModel from '../models/user.model.js';
import courseModel from '../models/course.model.js';
import mongoose from '../utils/mongoose.js';

export default {


  favorite: catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let array = [];
    var listFavorite
    // console.log(id)
    UserSchema.findOne({ _id: id }).then(async (user) => {
      listFavorite = user.favoriteCourses;
      // console.log(typeof(listFavorite));

      for (let idx = 0; idx < listFavorite.length; idx++) {
        var idCourse = listFavorite[idx];
        const _course = await CourseSchema.findOne({ _id: idCourse });
        array.push(_course);
      }

      console.log(array);
      res.render('vwFavorite/favorite', {
        courseJSON: JSON.stringify(array),
        favoriteCourses: mongooseFeature.mutipleMongooseToObject(array),
        layout: 'layout'
      })
    }).catch(next);

  }),

  show: catchAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(req.method)
    UserSchema.findById({ _id: id }).then((user) => {
      const image = user.image ? process.env.END_POINT + user.image.substring(9) : null;
      user.image = image;

      console.log(user)
      res.render('vwProfile/profile', {
        userJSON: JSON.stringify(user),
        user: mongooseFeature.mongooseToObject(user),
        layout: 'layout'
      })
    }
    ).catch(next);
  }),

  update: catchAsync(async (req, res, next) => {
    const id = req.params.id;
    // console.log(req.method)
    const updateData = {
      image: req.session.avatar ? req.session.avatar : '',
      ...req.body
    }
    UserSchema.findOneAndUpdate({ _id: id }, updateData)
      .then((data) => {
        if (data.image) {
          fs.unlinkSync(data.image);
        }
        res.redirect('/user/' + id)
      })
      .catch(next);
  }),

  changePassword: catchAsync(async (req, res, next) => {
    UserSchema.findOneAndUpdate({ _id: id }, req.body).then(() => {
      res.redirect('/user/' + id);
    }).catch(next);
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
