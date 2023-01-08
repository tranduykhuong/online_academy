import { Error } from 'mongoose';
import courseModel from '../models/course.model.js';
import userModel from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import mongoose from '../utils/mongoose.js';
import moment from 'moment';
import categoryModel from '../models/category.model.js'
import fieldModel from '../models/field.model.js';
import teacherformModel from '../models/teacherform.model.js';

export default {
 adCategory: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adCategorySideBar', {
   layout: 'layoutAdmin',
  });
 }),

 adCategoryMobile: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adCategoryMobile', {
   layout: 'layoutAdmin',
  });
 }),

 adCategoryWeb: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adCategoryWeb', {
   layout: 'layoutAdmin',
  });
 }),
 editCategory: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/editCategory', {
   layout: 'layoutAdmin',
  });
 }),
 detail: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adDetailCategory', {
   layout: 'layoutAdmin',
  });
 }),

 //[GET] /admin/dashboard
 dashboard: catchAsync(async (req, res, next) => {
  var totalstd = 0, newstd = 0;
  var totaltch = 0, newtc = 0;
  var categorylist = 0, totalcrs = 0;
  var totalMoney = 0, newcrs = 0;
  const today = moment().startOf('day');
  
  await userModel.find({role: 'student'}).then(user => {
    totalstd = user.length;
  });

  await userModel.find({
    createdAt: {
      $gte: today.toDate(),
      $lte: moment(today).endOf('day').toDate()
    },
    role: 'student',
  }).then(user => {
    newstd = user.length;
  });

  await userModel.find({role: 'teacher'}).then(user => {
    totaltch = user.length;
  });

  await userModel.find({
    createdAt: {
      $gte: today.toDate(),
      $lte: moment(today).endOf('day').toDate()
    },
    role: 'teacher',
  }).then(user => {
    newtc = user.length;
  });

  await courseModel.find({
    createdAt: {
      $gte: today.toDate(),
      $lte: moment(today).endOf('day').toDate()
    },
  }).then(course => {
    newcrs = course.length;
  });

  await courseModel.find().then(course => {
    totalcrs = course.length;
    for(var i = 0; i < course.length; i++)
    {
      totalMoney = totalMoney + course[i].studentList.length * course[i].price;
    }
  });

  await categoryModel.find().then(category => {
    categorylist = category.length;
  });

  var listrequest;
  await teacherformModel.find().sort({createdAt : -1}).limit(4).then(teacher => {
    listrequest = teacher;
  })

  await courseModel.find({accept: false}).sort({ _id: -1 }).limit(4).then(course => {
    res.render('vwDashboardAdmin/dashboardAdmin', {
      layout: 'layoutAdmin',
      listrq: mongoose.mutipleMongooseToObject(listrequest),
      students: totalstd,
      newstudents: newstd,
      teachers: totaltch,
      newteachers: newtc,
      newcourses: newcrs,
      totalcourses: totalcrs,
      budget: totalMoney,
      categoryl: categorylist,
      newestcourse: mongoose.mutipleMongooseToObject(course)
    });
  });
 }),

 //[CREATE] /admin/dashboard/acceptrequest/:idrequest
 acceptrequest: catchAsync(async (req, res, next) => {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  teacherformModel.findOne({_id: req.params.idrequest}).then(teacher =>{
    const obj = new userModel({
      name : teacher.name,
      password: generateString(8),
      email : teacher.email,
      gender : teacher.gender,
      role: "teacher",
      where: teacher.where,
      description: teacher.description,
      active: true,
    });

    obj.save();

    teacherformModel.deleteOne({_id: req.params.idrequest}).then(()=>{
      res.redirect('back');
    }).catch(next);
  })
 }),

 //[DELETE] /admin/dashboard/removerequest/:idrequest
 removerequest: catchAsync(async (req, res, next) => {
  teacherformModel.deleteOne({_id: req.params.idrequest}).then(()=>{
    res.redirect('back');
  }).catch(next);
 }),

 //[PATCH] /admin/dashboard/acceptcourse/:idcourse
 acceptcourse: catchAsync(async (req, res, next) => {
  courseModel.findByIdAndUpdate(req.params.idcourse, { accept: true },
    function (err, docs) {
    if (err){console.log(err)}
    else{
    }
  });
  res.redirect('back');
 }),

//[DELETE] /admin/dashboard/removecourse/:idcourse
 removecourse: catchAsync(async (req, res, next) => {
  console.log(req.params.idcourse);
  courseModel.deleteOne({ _id : req.params.idcourse})
      .then(() => res.redirect('back'))
      .catch(next);
 }),

 //[GET] /admin/deletecourse
 deletecourse: catchAsync(async (req, res, next) => {
  await courseModel.find({accept : true}).then(course =>{
      var lengthk = course.length;
    res.render('vwEditCourseAdmin/editcourseAdmin', {
     layout: 'layoutAdmin',
     lengthbody: lengthk,
     listcourse: mongoose.mutipleMongooseToObject(course)
    });
  });
 }),

//[DELETE] /admin/deletecourse/:idcourse
 dltcourse: catchAsync(async (req, res, next) => {
  console.log(req.params.idcourse);
  courseModel.deleteOne({ _id : req.params.idcourse})
      .then(() => res.redirect('back'))
      .catch(next);
 }),

 //[PATCH] /admin/deletecourse/disabled/:idcourse
 dsbcourse:catchAsync(async (req, res, next) => {
  console.log(req.params.idcourse);
  await courseModel.findOne({ _id: req.params.idcourse}).then(course =>{
    course.updateOne({ accept: false },
      function (err) {});

  res.redirect('back');
 });
}),

};
