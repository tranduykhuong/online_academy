import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';
import courseModel from '../models/course.model.js';
import mongoose from '../utils/mongoose.js';
import reviewModal from '../models/review.modal.js';
import userModel from '../models/user.model.js';

import Course from '../models/course.model.js';
import fieldModel from '../models/field.model.js';
import categoryModel from '../models/category.model.js';
import Email from '../utils/Email.js';

import Category from '../models/category.model.js'
import Field from '../models/field.model.js'
import mongooseFeature from '../utils/mongoose.js';
import mutipleMongooseToObject from '../utils/mongoose.js';

import User from '../models/user.model.js';
import APIFeatures from '../utils/apiFeature.js';

export default {
 addCourse: catchAsync(async (req, res, next) => {
  const step = parseInt(req.query.step);
  const idCourse = req.params.idCourse;

  // EDIT (get data from DB)
  if (idCourse && idCourse !== req.session.idCourse) {
   const data = await Course.findOne({ _id: idCourse });
   const intended = data.benifits.split('\n');

   req.session.idCourse = idCourse;

   // Use for multer
   req.session.fields = data.fieldsVideo;
   req.session.step1 = true;
   req.session.step2 = true;
   req.session.step3 = true;
   req.session.step4 = true;
   req.session.step5 = true;

   // step 1
   req.session.intended1 = intended[0] || '';
   req.session.intended2 = intended[1] !== 'undefined' ? intended[1] : '';
   req.session.intended3 = intended[2] !== 'undefined' ? intended[2] : '';
   req.session.who = data.who || '';

   // step 2
   // step 3
   req.session.name = data.name;
   req.session.summary = data.summary;
   req.session.description = data.description;
   req.session.category = data.field.category._id;
   req.session.field = data.field._id;
   req.session.image = data.image;
   req.session.videoDemo = data.videodemo;

   // step 4
   req.session.chapter = data.listChapter;
   req.session.completeCourse = data.status === 'completed' ? true : false;

   // step 5
   req.session.price = data.price;
   req.session.priceDiscount = data.priceDiscount;
   req.session.descriptionDiscount = data.descriptionDiscount;
  }

  switch (step) {
   case 1: {
    if (req.method === 'GET') {
     res.render('vwTeacher/addCourse/planCourse/intended', {
      layout: 'layoutAddCourse',
      intended1: req.session.intended1 || '',
      intended2: req.session.intended2 || '',
      intended3: req.session.intended3 || '',
      who: req.session.who || '',

      step1: req.session.step1,
      step2: req.session.step2,
      step3: req.session.step3,
      step4: req.session.step4,
      step5: req.session.step5,
      idCourse: idCourse ? '/' + idCourse : '',
     });
    } else {
     req.session.step1 = true;

     (req.session.intended1 = req.body.intended1 || req.session.intended1),
      (req.session.intended2 = req.body.intended2 || req.session.intended2),
      (req.session.intended3 = req.body.intended3 || req.session.intended3),
      (req.session.who = req.body.who || req.session.who);
     res.redirect(`/teacher/addCourse${idCourse ? '/' + idCourse : ''}?step=2`);
    }
    break;
   }
   case 2: {
    req.session.step2 = true;

    if (req.method === 'GET') {
     res.render('vwTeacher/addCourse/planCourse/courseStructure', {
      layout: 'layoutAddCourse',

      step1: req.session.step1,
      step2: req.session.step2,
      step3: req.session.step3,
      step4: req.session.step4,
      step5: req.session.step5,
      idCourse: idCourse ? '/' + idCourse : '',
     });
    } else {
     res.redirect(`/teacher/addCourse${idCourse ? '/' + idCourse : ''}?step=3`);
    }
    break;
   }
   case 3: {
    if (req.method === 'GET') {
     const image = req.session.image ? process.env.END_POINT + req.session.image.substring(9) : null;
     const videoDemo = req.session.videoDemo ? process.env.END_POINT + req.session.videoDemo.substring(9) : null;

     const categoryData = await Category.find().lean();
     const fieldData = await Field.find().lean();

     res.render('vwTeacher/addCourse/createContent/infoCourse', {
      layout: 'layoutAddCourse',
      name: req.session.name || '',
      summary: req.session.summary || '',
      description: req.session.description || '',
      category: req.session.category || '',
      field: req.session.field || '',
      image: image,
      videoDemo: videoDemo,

      step1: req.session.step1,
      step2: req.session.step2,
      step3: req.session.step3,
      step4: req.session.step4,
      step5: req.session.step5,
      idCourse: idCourse ? '/' + idCourse : '',
      categories: categoryData,
      categoryJSON: JSON.stringify(categoryData),
      fieldsJSON: JSON.stringify(fieldData),
      categorySelected: req.session.category,
      fieldSelected: req.session.field
     });
    } else {
     req.session.step3 = true;

     req.session.name = req.body.name || req.session.name;
     req.session.summary = req.body.summary || req.session.summary;
     req.session.description = req.body.description || req.session.description;
     req.session.category = req.body.category || req.session.category;
     req.session.field = req.body.field || req.session.field;

     res.redirect(`/teacher/addCourse${idCourse ? '/' + idCourse : ''}?step=4`);
    }
    break;
   }
   case 4: {
    if (!req.session.chapter) {
     req.session.chapter = [
      {
       chapter: 1,
       title: '',
       listVideo: [
        {
         chapter: 1,
         lession: 1,
         name: '',
         urlVideo: '',
         duration: 0,
         avtVideo: '',
        },
       ],
      },
     ];
    }

    const chapterData = JSON.parse(JSON.stringify(req.session.chapter));
    for (var el of chapterData) {
     for (var e of el.listVideo) {
      const linkAvt = e.avtVideo ? process.env.END_POINT + e.avtVideo.substring(9) : '';
      chapterData[parseInt(e.chapter) - 1].listVideo[parseInt(e.lession) - 1].avtVideo = linkAvt;
      const linkVideo = e.urlVideo ? process.env.END_POINT + e.urlVideo.substring(9) : '';
      chapterData[parseInt(e.chapter) - 1].listVideo[parseInt(e.lession) - 1].urlVideo = linkVideo;
     }
    }

    if (req.method === 'GET') {
      console.log(req.session.chapter)
     res.render('vwTeacher/addCourse/createContent/curriculum', {
      layout: 'layoutAddCourse',
      chapter: req.session.chapter,
      chapterJSON: JSON.stringify(chapterData),

      complete: req.session.completeCourse,
      step1: req.session.step1,
      step2: req.session.step2,
      step3: req.session.step3,
      step4: req.session.step4,
      step5: req.session.step5,
      idCourse: idCourse ? '/' + idCourse : '',
     });
    } else {
     req.session.step4 = true;

     // Update title, name of course
     const body = req.body;
     for (const key in body) {
      if (key.includes('title')) {
       const titleCat = key.split('|');
       req.session.chapter[parseInt(titleCat[0]) - 1].title = body[key];
      } else if (key.includes('name')) {
       const nameCat = key.split('|');
       req.session.chapter[parseInt(nameCat[0]) - 1].listVideo[parseInt(nameCat[2]) - 1].name = body[key];
      }
     }

     res.redirect(`/teacher/addCourse${idCourse ? '/' + idCourse : ''}?step=4`);
    }
    break;
   }
   case 5: {
    if (req.method === 'GET') {
     res.render('vwTeacher/addCourse/createContent/pricing', {
      layout: 'layoutAddCourse',
      price: req.session.price || '',
      priceDiscount: req.session.priceDiscount || '',
      descriptionDiscount: req.session.descriptionDiscount || '',

      step1: req.session.step1,
      step2: req.session.step2,
      step3: req.session.step3,
      step4: req.session.step4,
      step5: req.session.step5,
      idCourse: idCourse ? '/' + idCourse : '',
     });
    } else {
     req.session.step5 = true;

     req.session.price = req.body.price || req.session.price;
     req.session.priceDiscount = req.body.priceDiscount || req.session.priceDiscount;
     req.session.descriptionDiscount = req.body.descriptionDiscount || req.session.descriptionDiscount;

     res.redirect(`/teacher/addCourse${idCourse ? '/' + idCourse : ''}?step=5`);
    }
    break;
   }
   default:
    break;
  }
 }),

 addChapter: catchAsync(async (req, res, next) => {
  const arr = req.session.chapter;
  arr.push({
   chapter: arr.length + 1,
   title: '',
   listVideo: [
    {
     chapter: arr.length + 1,
     lession: 1,
     name: '',
     urlVideo: '',
     duration: 0,
     avtVideo: '',
    },
   ],
  });
  req.session.chapter = arr;

  // Inititalize fields for upload file
  if (!req.session.fields) {
   req.session.fields = [
    {
     name: 'image',
     maxCount: 1,
    },
    {
     name: 'videoDemo',
     maxCount: 1,
    },
    {
     name: '1|image|1',
     maxCount: 1,
    },
    {
     name: '1|video|1',
     maxCount: 1,
    },
   ];
  }
  req.session.fields.push(
   {
    name: `${arr.length}|image|1`,
    maxCount: 1,
   },
   {
    name: `${arr.length}|video|1`,
    maxCount: 1,
   }
  );
  res.json(req.session.chapter);
 }),

 addLession: catchAsync(async (req, res, next) => {
  const chapter = req.query.chapter;

  const arr = req.session.chapter;
  arr[chapter - 1].listVideo.push({
   chapter: parseInt(chapter),
   lession: arr[chapter - 1].listVideo.length + 1,
   name: '',
   urlVideo: '',
   duration: 0,
   avtVideo: '',
  });
  req.session.chapter = arr;
  console.log(req.session.chapter);


  // Inititalize fields for upload file
  if (!req.session.fields) {
   req.session.fields = [
    {
     name: 'image',
     maxCount: 1,
    },
    {
     name: 'videoDemo',
     maxCount: 1,
    },
    {
     name: '1|image|1',
     maxCount: 1,
    },
    {
     name: '1|video|1',
     maxCount: 1,
    },
   ];
  }
  req.session.fields.push(
   {
    name: `${chapter}|image|${arr[chapter - 1].listVideo.length}`,
    maxCount: 1,
   },
   {
    name: `${chapter}|video|${arr[chapter - 1].listVideo.length}`,
    maxCount: 1,
   }
  );
  res.json(req.session.chapter);
 }),

 completeCourse: catchAsync(async (req, res, next) => {
  console.log(req.session.completeCourse);
  req.session.completeCourse = !req.session.completeCourse;
  return res.json(true);
 }),

 submitCourse: catchAsync(async (req, res, next) => {
  if (req.session.step1 && req.session.step2 && req.session.step3 && req.session.step4 && req.session.step5) {
   const benifits = req.session.intended1 + '\n' + req.session.intended2 + '\n' + req.session.intended3;
   const data = {
    name: req.session.name,
    summary: req.session.summary,
    description: req.session.description,
    benifits: benifits,
    who: req.session.who,
    status: req.session.completeCourse ? 'completed' : 'in progress',
    image: req.session.image,
    videodemo: req.session.videoDemo,
    listChapter: req.session.chapter,
    price: req.session.price,
    priceDiscount: req.session.priceDiscount,
    descriptionDiscount: req.session.descriptionDiscount,

    field: req.session.field,
    createdBy: req.session.user._id,

    fieldsVideo: req.session.fields,
   };

   let result = '';
   if (req.session.idCourse) {
    try {
      result = await Course.findOneAndUpdate({ _id: req.session.idCourse }, data);
    } catch(err) {
      return res.json('Duplicate name');
    }
    console.log('Update course successfully!');
   } else {
    try {
      result = await Course.create(data);
    } catch(err) {
      return res.json('Duplicate name');
    }
    console.log('Create course successfully!');
   }

   req.session.idCourse = undefined;
   // Use for multer
   req.session.fields = undefined;
   req.session.step1 = undefined;
   req.session.step2 = undefined;
   req.session.step3 = undefined;
   req.session.step4 = undefined;
   req.session.step5 = undefined;

   // step 1
   req.session.intended1 = undefined;
   req.session.intended2 = undefined;
   req.session.intended3 = undefined;
   req.session.who = undefined;

   // step 2
   // step 3
   req.session.name = undefined;
   req.session.summary = undefined;
   req.session.description = undefined;
   req.session.category = undefined;
   req.session.field = undefined;
   req.session.image = undefined;
   req.session.videoDemo = undefined;

   req.session.field = undefined;

   // step 4
   req.session.chapter = undefined;
   req.session.completeCourse = undefined;

   // step 5
   req.session.price = undefined;
   req.session.priceDiscount = undefined;
   req.session.descriptionDiscount = undefined;

   console.log(result)
   res.json(true);
  } else {
   res.json(false);
  }
 }),

 home: catchAsync(async (req, res, next) => {
  const coursesCompleted = await Course.find({createdBy: req.session.user._id, status: 'completed'}).lean();
  const coursesNoCompleted = await Course.find({createdBy: req.session.user._id, status: 'in progress'}).lean();

  coursesCompleted.map((el) => {
    el.image = el.image.substring(8);
    el.ratingsAverage = new Array(parseInt(el.ratingsAverage)).fill(el.ratingsAverage);
    el.ratingsNo = new Array(5 - parseInt(el.ratingsAverage)).fill(0);
  })
  coursesNoCompleted.map((el) => {
    el.image = el.image.substring(8);
    el.ratingsAverage = new Array(parseInt(el.ratingsAverage)).fill(el.ratingsAverage);
    el.ratingsNo = new Array(5 - parseInt(el.ratingsAverage)).fill(0);
  })

  res.render('vwTeacher/homeTeacher', {
   layout: 'layoutTeacher',
   coursesCompleted: coursesCompleted,
   coursesNoCompleted: coursesNoCompleted
  });
 }),

 statistic: catchAsync(async (req, res, next) => {
  res.render('vwTeacher/statistic', {
   layout: 'layoutTeacher',
  });
 }),

//[GET] /course/:idcourse
courseDetail: catchAsync(async (req, res, next) => {
  var flagFvr, flagBuy = "true";
  var totalVideo = 0;
  var nbcourse;
  var totalStd = 0;
  var totalReview = 0;
  var totalTime = 0;
  var field;
  var samefieldcrs;

  await userModel.findOne({ _id: req.session.user._id}).then(user => {
  if(user.favoriteCourses.includes(req.params.idcourse) == true)
  {
    flagFvr = "false";
  }
  else{
    flagFvr = "true";
  }

  for(var i = 0; i < user.boughtCourses.length; i++){
    if(user.boughtCourses[i].idCourse == req.params.idcourse)
    {
      flagBuy = "false";
    }
  }
  courseModel.findOne({ _id: req.params.idcourse})
  .then(courseh =>
    {
      //Tìm tổng thời lượng của tất cả video khóa học
      for (var i = 0; i < courseh.listChapter.length; i++){
        for(var j = 0; j < courseh.listChapter[i].listVideo.length; j++)
        {
          totalTime = totalTime + courseh.listChapter[i].listVideo[j].duration;
        }
      }
      //Tìm tổng video của khóa học này
      for(var i = 0; i < courseh.listChapter.length; i++)
      {
        totalVideo = totalVideo + courseh.listChapter[i].listVideo.length;
      }

      //Tìm thông tin của thằng giảng viên
      courseModel.find({createdBy: courseh.createdBy}).then(courses => {
        nbcourse = courses.length;
        for(var i = 0; i < courses.length; i++)
        {
          totalStd = totalStd + courses[i].studentList.length;
          
          reviewModal.find({course: courses[i]._id}).then(rvs => {
            totalReview = totalReview + rvs.length;
          });

          //Tìm xem tất cả đánh giá
        }
      });

      //Tìm field của khóa học đã
      field = courseh.field;

      //Tìm 5 khóa học cùng field được mua nhiều nhất
      courseModel.find({accept: true, field : field}).sort({ studentList: -1 }).limit(5).then(courset => {
        samefieldcrs = courset;

        var sfieldp1 = samefieldcrs.slice(0,3);
        var sfieldp2 = samefieldcrs.slice(3,5);

        //console.log(req.session.entries);
        for(var i = 0; i < courseh.length; i++)
        {
          courseh[i].createAt = new Date(courseh[i].createAt);
        }

        console.log(courseh);

        var courseVideodemo = courseh.listChapter.shift();
        reviewModal.find({course: courseh._id}).then(reviews => {
          for(var j = 0; j < reviews.length; j++)
          {
            reviews[j].createAt = new Date(reviews[j].createAt);
          }

          res.render('vwCourseDetail/courseDetail', {
            listcategory: req.session.entries,
            numberReviews: totalReview,
            numberStudent: totalStd,
            numbercourse: nbcourse,
            numbervideo: totalVideo,
            totaltime: totalTime,
            coursevideodemo: mongoose.mongooseToObject(courseVideodemo),
            flagbuy: flagBuy,
            flagfvr: flagFvr,
            iduser: req.session.user._id,
            relative1: mongoose.mutipleMongooseToObject(sfieldp1),
            relative2: mongoose.mutipleMongooseToObject(sfieldp2),
            reviews: mongoose.mutipleMongooseToObject(reviews), 
            benifits: courseh.benifits.split('\n'), 
            course : mongoose.mongooseToObject(courseh) });
        });
        
      });
  })
  .catch(next);
});    
}),


//[POST] /course/:idcourse/createfeedback
createfeedback: catchAsync(async (req, res, next) => {
  if(req.body.starnb !== "")
  {
    const feedback = new reviewModal({
      course : req.params.idcourse,
      comment : req.body.feedback,
      rating : req.body.starnb,
      user: req.session.user._id
    });
    await feedback.save();
  }
  else{
    const feedback = new reviewModal({
      course : req.params.idcourse,
      comment : req.body.feedback,
      user: req.session.user._id
    });
    await feedback.save();
  }

  var starAverage = 0;
  await reviewModal.find({course: req.params.idcourse}).then(reviews => {
    reviews.map((value, index) =>{
      starAverage = starAverage + value.rating;
    });
    courseModel.findByIdAndUpdate(req.params.idcourse, { ratingsAverage: starAverage / reviews.length  },
                      function (err) {
    if (err){
        console.log(err)
    }

    });
  });
  
  res.redirect(`/course/${req.params.idcourse}#heading5`);
}),

  //[DELETE] /course/deletefeedback/:idfeedback
deletefeedback: catchAsync(async (req, res, next) => {
    reviewModal.deleteOne({ _id : req.params.idfeedback})
    .then(() => res.redirect(req.get('referer') + '#heading5'))
    .catch(next);
}),

//[PATCH] /course/:idcourse/addtofavorite/:flag
addtofavorite: catchAsync(async (req, res, next) => {
  await userModel.findOne({ _id: req.session.user._id}).then(user =>{
    if(req.params.flag == "true")
    {
      user.updateOne({ $push: { favoriteCourses: req.params.idcourse } },
      function (err) {});
    }
    else 
    {
      user.updateOne({ $pull: { favoriteCourses: req.params.idcourse } },
        function (err) {});
    }

  });
  res.redirect('back');
}),

//[PATCH] /course/:idcourse/buycourse/:flag
buycourse: catchAsync(async (req, res, next) => {
  var idchapterfirst, idlessonfirst;
  await courseModel.findOne({ _id: req.params.idcourse}).then(course => {
    idchapterfirst = course.listChapter[0]._id;
    idlessonfirst = course.listChapter[0].listVideo[0]._id;
  });

  await userModel.findOne({ _id: req.session.user._id}).then(user =>{
    if(req.params.flag == "true")
    {
      user.updateOne({ $push: { boughtCourses: {idCourse: req.params.idcourse, idChapter: idchapterfirst, idLesson: idlessonfirst, currentTime: 0} } },
      function (err) {});
    }
    else 
    {
      return;
    }

  });

  //Add thằng mới mua vô listStudent khóa học
  await courseModel.findOne({ _id: req.params.idcourse}).then(course => {
    if(req.params.flag == "true")
    {
      course.updateOne({ $push: { studentList: {studentId: req.session.user._id} } },
      function (err) {});
    }
    else 
    {
      return;
    }
  });
  res.redirect('back');
}),

viewVideo: catchAsync(async (req, res, next) => {
const id = req.params.idCourse;
const query = req.query;
const idUser = req.session.user._id;

const user = await User.findById({ _id: idUser });
const dataCourse = await Course.findById({ _id: id });

const course = mongooseFeature.mongooseToObject(dataCourse);

if (query.lesson) {
  if (req.session.lessonOld) {
  
  var data = [];
  user.boughtCourses.forEach((courseBought, index) => {
    if (courseBought.idCourse.toString() === id){
        data.push({
        idCourse: id,
        idChapter: req.session.chapterOld,
        idLesson: req.session.lessonOld,
        currentTime: query.currentTime,
        });
    }
    else{
      data.push(courseBought);
    }
  })

  await User.findByIdAndUpdate(idUser, {boughtCourses: data});
  }
  req.session.lessonOld = query.lesson;
  req.session.chapterOld = query.chapter;
}

var pathVideo = '';
var pathImage = '';
var nameLesson = '';
var isStudyPage = false;
user.boughtCourses.forEach((item, index) => {
  if (id === item.idCourse.toString()) {
  isStudyPage = true;

  pathVideo = course.videodemo;
  pathImage = course.image;
  nameLesson = 'Overview';
  var percentCourse;
  var currentLesson;
  var totalLesson = 0;
  var chapter = 0;
  var lesson = 0;
  var idChuong ='';
  var idBaihoc = '';
  var timeLesson;
  var listTimeChapter = [];
  const time_convert = (num) =>
  { 
    var hours = Math.floor(num / 60);  
    var minutes = num % 60;
    return hours + ":" + minutes;         
  }

  course.listChapter.forEach(item => {
    var timeChapter = 0;
    item.listVideo.forEach(video => {
      timeChapter+=video.duration;
    })
    listTimeChapter.push(timeChapter);
  })

  var listTimeChapterConvert = [];
  for (let i = 0;i<listTimeChapter.length;i++){
    var time = time_convert(Math.round(listTimeChapter[i]));
    listTimeChapterConvert.push(time);
  }

  // course.listChapter.push({totalTimeLesson: listTimeChapterConvert})
  course.listChapter.forEach((item, idx) => {
    item.value = listTimeChapterConvert[idx];
  })

  course.listChapter.forEach((item, index) => {
    totalLesson += item.listVideo.length;

    if (item._id.toString() === query.chapter) {
    
    if (item.chapter === 1){
      item.listVideo.forEach((video, idx) => {
        if (video._id.toString() === query.lesson) {
          video.currentLesson = true;

          lesson += idx + 1;
          pathVideo = video.urlVideo;
          pathImage = video.avtVideo;
          nameLesson = video.name;
          timeLesson = time_convert(Math.round(video.duration));
          video.timeLesson = timeLesson;
        }
        else{
          timeLesson = time_convert(Math.round(video.duration));
          video.timeLesson = timeLesson;
        }
        });
    }
    else{
      item.listVideo.forEach((video, idx) => {
        if (video._id.toString() === query.lesson) {
          video.currentLesson = true;
          
          lesson += item.chapter + 1;
          pathVideo = video.urlVideo;
          pathImage = video.avtVideo;
          nameLesson = video.name;
          timeLesson = time_convert(Math.round(video.duration));
          video.timeLesson = timeLesson;
        }
        });
    }
  }
  else{
    item.listVideo.forEach((video, idx) => {
      if (video._id.toString() === query.lesson) {
        video.currentLesson = true;

        lesson += idx + 1;
        pathVideo = video.urlVideo;
        pathImage = video.avtVideo;
        nameLesson = video.name;
        timeLesson = time_convert(Math.round(video.duration));
        video.timeLesson = timeLesson;
      }
      else{
        timeLesson = time_convert(Math.round(video.duration));
        video.timeLesson = timeLesson;
      }
      });
  }
  });


  res.render('vwviewVideo/viewVideo', {
    course: course,
    idCourse: id,
    layout: 'layoutEmpty',
    total: totalLesson,
    pathVideo: pathVideo.split('/').length > 3 ? `/${pathVideo.split('/')[2]}/${pathVideo.split('/')[3]}/${pathVideo.split('/')[4]}` : pathVideo,
    pathImage: pathImage.split('/').length > 3 ? `/${pathImage.split('/')[2]}/${pathImage.split('/')[3]}/${pathImage.split('/')[4]}` : pathImage,
    nameLesson: nameLesson.split('/').length > 3 ? `/${nameLesson.split('/')[2]}/${nameLesson.split('/')[3]}/${nameLesson.split('/')[4]}` : nameLesson,
    timeUpdateMonth: course.updatedAt.getMonth() + 1,
    timeUpdateYear: course.updatedAt.getFullYear(),
    lessonCurrent: lesson,
  });
  }
});
if (!isStudyPage) {
  res.redirect(`/course/${id}`);
}
}),

courses: catchAsync(async (req, res, next) => {
var pages = [];
var page = req.query.offset || 1;
var limit = 12;
var query = {...req.query, limit: limit};
const dataCategory = await Category.find();
const category = mongooseFeature.mutipleMongooseToObject(dataCategory)
for (let i = 0;i<category.length;i++){
  if (category[i]._id.toString() === req.query.category)
  {
    category[i].currentCategory = true;
    break;
  }
    
}

const features = new APIFeatures(Course.find(), query)
                                .sort()
                                .paginate()

const totalCourse = await Course.find();
var dataCourses = await features.query;
var courses = JSON.parse(JSON.stringify(dataCourses));

courses.forEach(item => {
  item.createdAt = new Date(item.createdAt);
})

var isEmpty = courses.length === 0;
var len;
if (!isEmpty)
{
  len = (mongooseFeature.mutipleMongooseToObject(totalCourse).filter(item => item.accept === true).length) / limit;
  for (let i = 0; i < Math.ceil(len); i++){
    pages.push({
      value: i+1,
      isCurrent: +page === i+1,
    });
  }
}

var isCreateAt = false;
var isOutStanding = false;
var isCategory = false;
var isRating = false;
if (req.query.sort === '-createAt'){
  isCreateAt = true;
  isOutStanding = false;
  isRating = false;


  courses.forEach(item => {
    item.isCreateAt = isCreateAt;
  })

  courses.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
else if (req.query.sort === 'outstanding'){
  isOutStanding = true;
  isCreateAt = false;
  isRating = false;


  courses.forEach(item => {
    item.isOutStanding = isOutStanding;
  })

  for (let i = 0; i < courses.length -1; i++){
    for (let j = i + 1; j < courses.length; j++){
      if (courses[i].studentList.length < courses[j].studentList.length){
        const temp  = courses[i];
        courses[i] = courses[j];
        courses[j] = temp;
      }
    }
  }

  courses = courses.slice(0, 4).filter(item => item.studentList.length !== 0);
}
else if (req.query.sort === 'rating'){
  isRating = true;
  isOutStanding = false;
  isCreateAt = false;

  // for (let i = 0; i < courses.length -1; i++){
  //   for (let j = i + 1; j < courses.length; j++){
  //     if (Math.ceil(courses[i].ratingsAverage) < Math.ceil(courses[j].ratingsAverage)){
  //       const temp  = courses[i];
  //       courses[i] = courses[j];
  //       courses[j] = temp;
  //     }
  //   }
  // }
  courses.forEach(item => {
    item.isRating = isRating;
  })

  console.log(courses);

  courses = courses.filter(item => Math.ceil(item.ratingsAverage) === 5)
}

if (req.query.category){
  isCategory = true;
  pages = [];
  courses = courses.filter(item => item.field.category.name === req.query.category);
  isEmpty = courses.filter(item => item.accept === true).length === 0;
  if (!isEmpty)
  {
    len = (mongooseFeature.mutipleMongooseToObject(totalCourse).filter(item => item.accept === true).length) / limit;
    for (let i = 0; i < Math.ceil(len); i++){
      pages.push({
        value: i+1,
        isCurrent: +page === i+1,
      });
    }
  }
}

res.render('vwCourses/courses', {
  layout: 'layout',
  course: courses.filter(item => item.accept === true),
  category: category,
  total: pages,
  prev: +page !==1 ? +page - 1 : +page,
  next: +page > len ? +page : +page + 1,
  isCreateAt: isCreateAt,
  isOutStanding: isOutStanding,
  isEmpty: isEmpty,
  isCategory: isCategory,
  isRating: isRating
  });
}),

};
