import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';
import Email from '../utils/Email.js';

import Course from '../models/course.model.js';
import Category from '../models/category.model.js'
import Field from '../models/field.model.js'

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

 viewVideo: catchAsync(async (req, res, next) => {
  res.render('vwviewVideo/viewVideo', {
   layout: 'layoutEmpty',
  });
 }),

 courseDetail: catchAsync(async (req, res, next) => {
  res.render('vwCourseDetail/courseDetail', {
   layout: 'layout',
  });
 }),
};
