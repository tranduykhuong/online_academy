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

 viewVideo: catchAsync(async (req, res, next) => {
  res.render('vwviewVideo/viewVideo', {
    layout: 'layoutEmpty'
  })
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

    await userModel.findOne({ _id: '63af99d9bbc55b73d3b1761c'}).then(user => {
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

          console.log(req.session.entries);

          var courseVideodemo = courseh.listChapter.shift();
          reviewModal.find({course: courseh._id}).then(reviews => {
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
              iduser: '63af99d9bbc55b73d3b1761c',
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
        user: req.body.iduser
      });
      await feedback.save();
    }
    else{
      const feedback = new reviewModal({
        course : req.params.idcourse,
        comment : req.body.feedback,
        user: req.body.iduser
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
    await userModel.findOne({ _id: '63af99d9bbc55b73d3b1761c'}).then(user =>{
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
    await userModel.findOne({ _id: '63af99d9bbc55b73d3b1761c'}).then(user =>{
      if(req.params.flag == "true")
      {
        user.updateOne({ $push: { boughtCourses: {idCourse: req.params.idcourse} } },
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
        course.updateOne({ $push: { studentList: {studentId: '63af99d9bbc55b73d3b1761c'} } },
        function (err) {});
      }
      else 
      {
        return;
      }
    });
    res.redirect('back');
  }),

};
