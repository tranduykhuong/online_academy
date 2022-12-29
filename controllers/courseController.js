import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';

import Course from '../models/course.model.js';

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

      fieldsVideo: req.session.fields
    }

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
};
