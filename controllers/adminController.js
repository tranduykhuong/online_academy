import { Error } from 'mongoose';
import courseModel from '../models/course.model.js';
import userModel from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import mongoose from '../utils/mongoose.js';
import Course from '../models/course.model.js';
import Field from '../models/field.model.js';
import category from '../models/category.model.js';
import User from '../models/user.model.js';

import CategorySchema from '../models/category.model.js';
import mongooseFeature from '../utils/mongoose.js';

import moment from 'moment';
import categoryModel from '../models/category.model.js';
import fieldModel from '../models/field.model.js';
import teacherformModel from '../models/teacher-form.model.js';

export default {
 //teacher
 allTeacher: catchAsync(async (req, res, next) => {
  var ListTeacher = await User.find({ role: 'teacher', accept: true }).lean();
  // console.log(ListTeacher);

  res.render('vwTeacherAdmin/all-professors', {
   layout: 'layoutAdmin',
   ListTeachers: ListTeacher,
  });
 }),
 addTeacher: catchAsync(async (req, res, next) => {
  res.render('vwTeacherAdmin/add-professor', {
   layout: 'layoutAdmin',
  });
 }),
 editTeacher: catchAsync(async (req, res, next) => {
  const id = req.query.id || 0;
  console.log('id lay duoc: ' + id);

  const user = await User.findOne({ _id: id }).lean();
  // console.log(user.name);

  res.render('vwTeacherAdmin/edit-professor', {
   layout: 'layoutAdmin',
   users: user,
  });
 }),
 teacherProfile: catchAsync(async (req, res, next) => {
  const id = req.query.id || 0;
  // console.log("id lay duoc: " + id);

  const user = await User.findOne({ _id: id }).lean();

  res.render('vwTeacherAdmin/professor-profile', {
   layout: 'layoutAdmin',
   users: user,
  });
 }),
 //student
 allStudents: catchAsync(async (req, res, next) => {
  var ListStudent = await User.find({ role: 'student', accept: true }).lean();
  // console.log(ListStudent)

  res.render('vwStudentAdmin/all-students', {
   layout: 'layoutAdmin',
   listStudent: ListStudent,
  });
 }),
 addStudent: catchAsync(async (req, res, next) => {
  res.render('vwStudentAdmin/add-student', {
   layout: 'layoutAdmin',
  });
 }),
 editStudent: catchAsync(async (req, res, next) => {
  const id = req.query.id || 0;
  // console.log("id lay duoc: " + id);

  const user = await User.findOne({ _id: id }).lean();
  res.render('vwStudentAdmin/edit-student', {
   layout: 'layoutAdmin',
   users: user,
  });
 }),
 studentProfile: catchAsync(async (req, res, next) => {
  res.render('vwStudentAdmin/about-student', {
   layout: 'layoutAdmin',
  });
 }),

 deleteStudent: catchAsync(async function (req, res) {
  const id = req.query.id || 0;
  const ret = await User.deleteOne({ _id: id });
  console.log(ret);
  res.redirect('admin/allStudents');
 }),
 addNewStudent: catchAsync(async function (req, res) {
  const ret = await User.add(req.body);
  console.log(ret);
  res.redirect('admin/allStudents');
 }),

 //  Vinh
 adCategory: catchAsync(async (req, res, next) => {
  var listCategory = [];
  var lenField;
  CategorySchema.find()
   .then(async (category) => {
    category = JSON.parse(JSON.stringify(category));

    for (let idx = 0; idx < category.length; idx++) {
     const field = await fieldModel.find({ category: category[idx]._id });
     lenField = field.length;
     const updateData = {
      ...category[idx],
      amount: lenField,
     };
     listCategory.push(updateData);
    }

    res.render('vwCategoryAdmin/adCategory', {
     allCategory: listCategory,
     layout: 'layoutAdmin',
    });
   })
   .catch(next);
 }),

 isAvailable: catchAsync(async (req, res, next) => {
  const categoryname = req.query.categoryName;
  const _category = await CategorySchema.findOne({ name: categoryname });
  console.log(_category);
  if (_category === null) {
   return res.json(true);
  }
  res.json(false);
 }),

 listField: catchAsync(async (req, res, next) => {
  const idCategory = req.params.id;
  var lenCourse;
  var listField = [];
  var cateName;
  var cateDescrition;
  var createDate;
  fieldModel
   .find({ category: idCategory })
   .then(async (field) => {
    // console.log(field)

    field = JSON.parse(JSON.stringify(field));

    for (let idx = 0; idx < field.length; idx++) {
     cateName = field[0].category.name;
     cateDescrition = field[0].category.description;
     createDate = field[0].category.updatedAt;
     const courses = await courseModel.find({ field: field[idx]._id });
     lenCourse = courses.length;
     const updateData = {
      ...field[idx],
      amount: lenCourse,
     };
     listField.push(updateData);
    }

    console.log(listField);
    res.render('vwCategoryAdmin/adField', {
     createDate,
     categoryDescrition: cateDescrition,
     categoryName: cateName,
     updateData: listField,
     layout: 'layoutAdmin',
    });
   })
   .catch(next);
 }),

 addCategory: catchAsync(async (req, res, next) => {
  // console.log(req.body);
  CategorySchema.create(req.body)
   .then(() => {
    res.redirect('/admin');
   })
   .catch(() => {
    res.render('vwCategoryAdmin/adCategory', {
     layout: 'layoutAdmin',
    });
   });
 }),

 detail: catchAsync(async (req, res, next) => {
  const _idField = req.params.idField;
  console.log(_idField);
  var nameField;
  var descriptionField;
  var createedField;
  // const coursesCompleted = await Course.find({ createdBy: '63af9b69bbc55b73d3b1761e', status: 'completed' }).lean();

  courseModel
   .find({ field: _idField })
   .then(async (course) => {
    // console.log
    course = JSON.parse(JSON.stringify(course));
    course.map((el) => {
     el.ratingsNo = new Array(5 - Math.round(el.ratingsAverage)).fill(0);
     el.ratingsAverage = new Array(Math.round(el.ratingsAverage)).fill(0);
    });

    // nameField = course ? course[0]?.field.name : 0;
    // descriptionField = course ? course[0]?.field.description : 0;
    // createedField = course ? course[0]?.field.createdAt : 0;
    const fields = await fieldModel.findOne({ _id: _idField });
    console.log(fields);

    res.render('vwCategoryAdmin/adDetailCategory', {
     layout: 'layoutAdmin',
     courses: course,
     fieldsDetail: mongooseFeature.mongooseToObject(fields),
    });
   })
   .catch(next);
 }),

 editCategory: catchAsync(async (req, res, next) => {
  var lenCourse;
  var listField = [];
  var categoryList;
  fieldModel
   .find()
   .then(async (field) => {
    field = JSON.parse(JSON.stringify(field));
    for (let idx = 0; idx < field.length; idx++) {
     const courses = await courseModel.find({ field: field[idx]._id });
     categoryList = await CategorySchema.find();
     lenCourse = courses.length;
     const updateData = {
      ...field[idx],
      amount: lenCourse,
     };
     listField.push(updateData);
    }

    // console.log(categoryList);
    res.render('vwCategoryAdmin/editCategory', {
     allField: listField,
     categoryLists: mongooseFeature.mutipleMongooseToObject(categoryList),
     layout: 'layoutAdmin',
    });
   })
   .catch(next);
 }),

 showUpdateField: catchAsync(async (req, res, next) => {
  const _idField = req.params.id;
  const categoryList = await CategorySchema.find();
  var idCate;
  fieldModel
   .findOne({ _id: _idField })
   .then(async (field) => {
    idCate = field ? field.category._id : 0;
    res.render('vwCategoryAdmin/adEditField', {
     categoryJSON: JSON.stringify(categoryList),
     idCategorySelected: idCate,
     FieldDeail: mongooseFeature.mongooseToObject(field),
     categorys: mongooseFeature.mutipleMongooseToObject(categoryList),
     layout: 'layoutAdmin',
    });
   })
   .catch(next);
 }),

 updateField: catchAsync(async (req, res, next) => {
  const id = req.params.id;
  // console.log('cho chinh', req.body);
  const { name } = req.body;
  const categoryList = await CategorySchema.find();
  const field = await fieldModel.findOne({ name });

  const fieldSelect = await fieldModel.findOne({ _id: id });
  var idFieldSelected = fieldSelect.category._id;
  console.log(idFieldSelected);

  const data = {
   _id: id,
   ...req.body,
  };
  if (field) {
   return res.render('vwCategoryAdmin/adEditField', {
    categoryJSON: JSON.stringify(categoryList),
    layout: 'layoutAdmin',
    FieldDeail: data,
    idCategorySelected: idFieldSelected,
    category: req.body.category,
    categorys: mongooseFeature.mutipleMongooseToObject(categoryList),
    status: true,
   });
  }

  fieldModel
   .findOneAndUpdate({ _id: id }, req.body)
   .then(() => {
    res.redirect('/admin/editCategory');
   })
   .catch(next);
 }),

 deleteField: catchAsync(async (req, res, next) => {
  const id = req.params.id;
  fieldModel
   .findByIdAndDelete({ _id: id })
   .then(() => res.redirect('back'))
   .catch(next);
 }),

 //  Khoi
 //[GET] /admin/dashboard
 dashboard: catchAsync(async (req, res, next) => {
  var totalstd = 0,
   newstd = 0;
  var totaltch = 0,
   newtc = 0;
  var categorylist = 0,
   totalcrs = 0;
  var totalMoney = 0,
   newcrs = 0;
  const today = moment().startOf('day');

  await userModel.find({ role: 'student' }).then((user) => {
   totalstd = user.length;
  });

  await userModel
   .find({
    createdAt: {
     $gte: today.toDate(),
     $lte: moment(today).endOf('day').toDate(),
    },
    role: 'student',
   })
   .then((user) => {
    newstd = user.length;
   });

  await userModel.find({ role: 'teacher' }).then((user) => {
   totaltch = user.length;
  });

  await userModel
   .find({
    createdAt: {
     $gte: today.toDate(),
     $lte: moment(today).endOf('day').toDate(),
    },
    role: 'teacher',
   })
   .then((user) => {
    newtc = user.length;
   });

  await courseModel
   .find({
    createdAt: {
     $gte: today.toDate(),
     $lte: moment(today).endOf('day').toDate(),
    },
   })
   .then((course) => {
    newcrs = course.length;
   });

  await courseModel.find().then((course) => {
   totalcrs = course.length;
   for (var i = 0; i < course.length; i++) {
    totalMoney = totalMoney + course[i].studentList.length * course[i].price;
   }
  });

  await categoryModel.find().then((category) => {
   categorylist = category.length;
  });

  var listrequest;
  await teacherformModel
   .find()
   .sort({ createdAt: -1 })
   .limit(4)
   .then((teacher) => {
    listrequest = teacher;
   });

  await courseModel
   .find({ accept: false })
   .sort({ _id: -1 })
   .limit(4)
   .then((course) => {
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
     newestcourse: mongoose.mutipleMongooseToObject(course),
    });
   });
 }),

 //[CREATE] /admin/dashboard/acceptrequest/:idrequest
 acceptrequest: catchAsync(async (req, res, next) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateString(length) {
   let result = ' ';
   const charactersLength = characters.length;
   for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  }

  teacherformModel.findOne({ _id: req.params.idrequest }).then((teacher) => {
   const obj = new userModel({
    name: teacher.name,
    password: generateString(8),
    email: teacher.email,
    gender: teacher.gender,
    role: 'teacher',
    where: teacher.where,
    description: teacher.description,
    active: true,
   });

   obj.save();

   teacherformModel
    .deleteOne({ _id: req.params.idrequest })
    .then(() => {
     res.redirect('back');
    })
    .catch(next);
  });
 }),

 //[DELETE] /admin/dashboard/removerequest/:idrequest
 removerequest: catchAsync(async (req, res, next) => {
  teacherformModel
   .deleteOne({ _id: req.params.idrequest })
   .then(() => {
    res.redirect('back');
   })
   .catch(next);
 }),

 //[PATCH] /admin/dashboard/acceptcourse/:idcourse
 acceptcourse: catchAsync(async (req, res, next) => {
  courseModel.findByIdAndUpdate(req.params.idcourse, { accept: true }, function (err, docs) {
   if (err) {
    console.log(err);
   } else {
   }
  });
  res.redirect('back');
 }),

 //[DELETE] /admin/dashboard/removecourse/:idcourse
 removecourse: catchAsync(async (req, res, next) => {
  console.log(req.params.idcourse);
  courseModel
   .deleteOne({ _id: req.params.idcourse })
   .then(() => res.redirect('back'))
   .catch(next);
 }),

 //[GET] /admin/deletecourse
 deletecourse: catchAsync(async (req, res, next) => {
  await courseModel.find({ accept: true }).then((course) => {
   var lengthk = course.length;
   res.render('vwEditCourseAdmin/editcourseAdmin', {
    layout: 'layoutAdmin',
    lengthbody: lengthk,
    listcourse: mongoose.mutipleMongooseToObject(course),
   });
  });
 }),

 //[DELETE] /admin/deletecourse/:idcourse
 dltcourse: catchAsync(async (req, res, next) => {
  console.log(req.params.idcourse);
  courseModel
   .deleteOne({ _id: req.params.idcourse })
   .then(() => res.redirect('back'))
   .catch(next);
 }),

 //[PATCH] /admin/deletecourse/disabled/:idcourse
 dsbcourse: catchAsync(async (req, res, next) => {
  console.log(req.params.idcourse);
  await courseModel.findOne({ _id: req.params.idcourse }).then((course) => {
   course.updateOne({ accept: false }, function (err) {});

   res.redirect('back');
  });
 }),
 //[DELETE teacehr]
 delTeacher: catchAsync(async (req, res, next) => {
  console.log("xóa: id giáo viên lấy được: "+req.params.idTeacher);
  User
   .deleteOne({ _id: req.params.idTeacher })
   .then(() => res.redirect('back'))
   .catch(next);
 }),

 //[DELETE student]
 delStudent: catchAsync(async (req, res, next) => {
  console.log("xóa: id hs lấy được: " +req.params.idStudent);
  User
   .deleteOne({ _id: req.params.idStudent })
   .then(() => res.redirect('back'))
   .catch(next);
 }),

 adTeacher: catchAsync(async (req, res, next) => {
  console.log(req.query);
  User
  .create({name: req.query.name, email: req.query.email, password: req.query.pass, role: "teacher" })
  .then(() => res.redirect('/admin/allTeachers'))
  .catch(next);
 }),

 adStudent: catchAsync(async (req, res, next) => {
  console.log(req.query);
  User
  .create({name: req.query.name, email: req.query.email, password: req.query.pass})
  .then(() => res.redirect('/admin/allStudents'))
  .catch(next);
 }),
//[edit student and teacher]
 edtStudent: catchAsync(async (req, res, next) => {
  console.log("lấy giá trị query hàm chỉnh")
  console.log(req.query);
  User
  .findOneAndUpdate({_id: req.query.id}, {name: req.query.name, gender: req.query.gender, address: req.query.address})
  .then(() => res.redirect('/admin/allStudents'))
  .catch((error)=>{
    console.log(error);
    next();
  });
 }),

 edtTeacher: catchAsync(async (req, res, next) => {
  console.log("lấy giá trị query hàm chỉnh")
  console.log(req.query);
  User
  .findOneAndUpdate({_id: req.query.id}, {name: req.query.name, gender: req.query.gender, address: req.query.address})
  .then(() => res.redirect('/admin/allTeachers'))
  .catch((error)=>{
    console.log(error);
    next();
  });
 }),
};
