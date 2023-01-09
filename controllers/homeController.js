// import { Error } from 'mongoose';
import mongoose from '../utils/mongoose.js';
import catchAsync from '../utils/catchAsync.js';
import Course from '../models/course.model.js';
import Field from '../models/field.model.js';
import category from '../models/category.model.js';

//hàm fomat time
function formatDate2(date) {
 var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

 if (month.length < 2) month = '0' + month;
 if (day.length < 2) day = '0' + day;

 return [year, month, day].join('-');
}

//hàm tính khoảng cách ngày
function dateDiffInDays(a, b) {
 return ((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)).toFixed(0);
}

export default {
 home: catchAsync(async (req, res, next) => {
  //các khóa học mới nhất
  const course = await Course.find({ accept: true }).sort({ createdAt: 'desc' }).lean();

  //các khóa học được đăng kí nhiều nhất - được xem nhiều nhất
  var courseRatingSubcribe = await Course.find({ accept: true }).sort({ studentList: 'desc' }).lean(); //đúng dữ liệu
  // console.log(courseRatingSubcribe);

  //khóa học được đăng kí nhiều nhất trong tuần - nổi bật nhất trong tuần
  var courseRatingSubcribeInWeek = courseRatingSubcribe.filter((u) => dateDiffInDays(new Date(formatDate2(u.createdAt)), new Date()) < 8);
  // console.log(courseRatingSubcribeInWeek);//đúng dữ liệu

  // lấy danh sách khóa học theo lĩnh vực sau đó tính tổng số đăng kí trong từng khóa học của từng lĩnh vực trong tuần
  const fields = await Field.find({ accept: true }).lean(); //lấy các lĩnh vực

  var ListRatingOfField = [];

  for (let index = 0; index < fields.length; index++) {
   var BestOfField = {
    id: '',
    fieldName: '',
    value: 0,
   };
   var sum = 0;
   const coursesOfField = await Course.find({ field: fields[index]._id, accept: true });
   coursesOfField
    .filter((u) => dateDiffInDays(new Date(formatDate2(u.createdAt)), new Date()) < 8)
    .map((value) => {
     console.log(value.studentList);
     if (value.studentList == null) {
      console.log('Dữ liệu null');
     } else {
      sum += mongoose.mongooseToObject(value).studentList.length;
     }
    });

   console.log('index: ' + index + 'sum: ' + sum);
   BestOfField.id = fields[index]._id;
   BestOfField.fieldName = fields[index].name;
   BestOfField.description = fields[index].description;
   BestOfField.value = sum;
   ListRatingOfField = [...ListRatingOfField, BestOfField];
  }

  ListRatingOfField = ListRatingOfField.sort(function (a, b) {
   return b.value - a.value;
  });
  console.log(ListRatingOfField);

  // //danh sách khóa học theo lĩnh vực đăng kí nhiều nhất trong tuần qua
  // const courseBestOfField = await Course.find({field: BestOfField.fieldName, accept: true}).filter(
  //   (u) => dateDiffInDays(new Date(formatDate2(u.createdAt)), new Date()) < 8
  // );
  // // console.log(courseBestOfField);

  var ListCard = [5];
  course.forEach((element) => {
   var newCard;
   newCard = {
    id: element._id,
    fieldName: element.field.category.name,
    name: element.name,
    summary: element.summary,
    studentLength: element.studentList.length,
    price: element.price,
    who: element.who,
    image: element.image,
    rating: element.ratingsAverage,
   };

   ListCard = [...ListCard, newCard];
  });

  //====List khóa học========
  //10 khóa học mới nhất ở mọi lĩnh vực
  ListCard = ListCard.slice(1, 10);
  //10 khóa học được xem nhiều nhất ở mọi lĩnh vực
  courseRatingSubcribe = courseRatingSubcribe.slice(1, 10);
  //3 khóa nổi bật nhất trong tuần
  courseRatingSubcribeInWeek = courseRatingSubcribeInWeek.slice(1, 4);
  //5 lĩnh vưc được đăng kí học nhiều nhất tuần qua
  if (ListRatingOfField.length > 5) {
   ListRatingOfField = ListRatingOfField.splice(1, 6);
  }

  var listresult = [];

  Field
   .find({})
   .select('category, name')
   .then((fields) => {
    //console.log(fields);
    for (var i = 0; i < fields.length; i++) {
     var object = {
      idctgr: fields[i].category._id,
      namectgr: fields[i].category.name,
      listfield: fields[i].name,
     };
     listresult = [...listresult, object];
    }
    //console.log(listresult);

    function groupBy(xs, f) {
     return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }
    const result = groupBy(listresult, (c) => c.namectgr);

    //console.log(result);
    const entries = Object.entries(result);

    //console.log(entries);

    req.session.entries = entries;

    res.render('home', {
     listcategory: req.session.entries,
     courseSpecial: courseRatingSubcribeInWeek,
     coursesNews: ListCard,
     courseRatingVeiwer: courseRatingSubcribe,
     courseBestRatingOfField: ListRatingOfField,
    });
   });
 }),
};
