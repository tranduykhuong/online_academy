import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';
import mongooseFeature from '../utils/mongoose.js';
import mutipleMongooseToObject from '../utils/mongoose.js';

import Course from '../models/course.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';
import APIFeatures from '../utils/apiFeature.js';

export default {
 addCourse: catchAsync(async (req, res, next) => {
  const step = parseInt(req.query.step);

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
     });
    } else {
     req.session.step1 = true;

     (req.session.intended1 = req.body.intended1 || req.session.intended1),
      (req.session.intended2 = req.body.intended2 || req.session.intended2),
      (req.session.intended3 = req.body.intended3 || req.session.intended3),
      (req.session.who = req.body.who || req.session.who);
     res.redirect('/teacher/addCourse?step=2');
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
     });
    } else {
     res.redirect('/teacher/addCourse?step=3');
    }
    break;
   }
   case 3:
    if (req.method === 'GET') {
     const image = req.session.image ? process.env.END_POINT + req.session.image.substring(9) : null;
     const videoDemo = req.session.videoDemo ? process.env.END_POINT + req.session.videoDemo.substring(9) : null;

     res.render('vwTeacher/addCourse/createContent/infoCourse', {
      layout: 'layoutAddCourse',
      name: req.session.name || '',
      summary: req.session.summary || '',
      description: req.session.description || '',
      categoty: req.session.categoty || '',
      field: req.session.field || '',
      image: image,
      videoDemo: videoDemo,

      step1: req.session.step1,
      step2: req.session.step2,
      step3: req.session.step3,
      step4: req.session.step4,
      step5: req.session.step5,
     });
    } else {
     req.session.step3 = true;

     req.session.name = req.body.name || req.session.name;
     req.session.summary = req.body.summary || req.session.summary;
     req.session.description = req.body.description || req.session.description;
     req.session.category = req.body.category || req.session.category;
     req.session.field = req.body.field || req.session.field;

     res.redirect('/teacher/addCourse?step=4');
    }
    break;
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

     res.redirect('/teacher/addCourse?step=4');
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
     });
    } else {
     req.session.step5 = true;

     req.session.price = req.body.price || req.session.price;
     req.session.priceDiscount = req.body.priceDiscount || req.session.priceDiscount;
     req.session.descriptionDiscount = req.body.descriptionDiscount || req.session.descriptionDiscount;

     res.redirect('/teacher/addCourse?step=5');
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
   avtVideo: '',
  });
  req.session.chapter = arr;

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

    fieldsVideo: req.session.fields,
   };

   const result = await Course.create(data);

   return res.json(result);
  } else {
   return res.json(false);
  }
 }),

 home: catchAsync(async (req, res, next) => {
  res.render('vwTeacher/homeTeacher', {
   layout: 'layoutTeacher',
  });
 }),

 statistic: catchAsync(async (req, res, next) => {
  res.render('vwTeacher/statistic', {
   layout: 'layoutTeacher',
  });
 }),

 viewVideo: catchAsync(async (req, res, next) => {
  const id = req.params.idCourse;
  const query = req.query;
  const idUser = '63af99d9bbc55b73d3b1761c';

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
   res.redirect(`/courses/${id}`);
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

 courseDetail: catchAsync(async (req, res, next) => {
  res.render('vwCourseDetail/courseDetail', {
   layout: 'layout',
  });
 }),
};
