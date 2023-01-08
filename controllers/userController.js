import { Error, Schema } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import UserSchema from '../models/user.model.js';
import mongooseFeature from '../utils/mongoose.js';
import CourseSchema from '../models/course.model.js';
import fs from 'fs';

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
};
