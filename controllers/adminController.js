import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import mongoose from '../utils/mongoose.js';
import Course from '../models/course.model.js';
import Field from '../models/field.model.js';
import category from '../models/category.model.js';
import User from '../models/user.model.js';


import CategorySchema from '../models/category.model.js';
import fieldModel from '../models/field.model.js';
import mongooseFeature from '../utils/mongoose.js';
import courseModel from '../models/course.model.js';


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
    //teacher
    allTeacher: catchAsync(async (req, res, next) => {
        var ListTeacher = await User.find({role: "teacher", accept: true}).lean();
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
        console.log("id lay duoc: " + id);

        const user = await User.findOne({_id: id}).lean();
        // console.log(user.name);

        
        res.render('vwTeacherAdmin/edit-professor', {
            layout: 'layoutAdmin',
            users: user,
        });
    }),
    teacherProfile: catchAsync(async (req, res, next) => {
        const id = req.query.id || 0;
        // console.log("id lay duoc: " + id);

        const user = await User.findOne({_id: id}).lean();

        res.render('vwTeacherAdmin/professor-profile', {
            layout: 'layoutAdmin',
            users: user
        });
    }),
    //student
    allStudents: catchAsync(async (req, res, next) => {
        var ListStudent = await User.find({role: "student", accept: true}).lean();
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

        const user = await User.findOne({_id: id}).lean();
        res.render('vwStudentAdmin/edit-student', {
            layout: 'layoutAdmin',
            users: user
        });
    }),
    studentProfile: catchAsync(async (req, res, next) => {
        
        res.render('vwStudentAdmin/about-student', {
            layout: 'layoutAdmin',
        });
    }),

    deleteStudent: catchAsync(async function(req, res){
        const id = req.query.id || 0;
        const ret = await User.deleteOne({_id: id});
        console.log(ret);
        res.redirect('admin/allStudents');
    }),
    addNewStudent: catchAsync(async function(req, res){
        const ret = await User.add(req.body);
        console.log(ret);
        res.redirect('admin/allStudents');
    }),


    adCategory: catchAsync(async (req, res, next) => {
      var listCategory = [];
      var lenField;
      CategorySchema.find().then(async (category) => {

          category = JSON.parse(JSON.stringify(category))

          for (let idx = 0; idx < category.length; idx++) {
              const field = await fieldModel.find({ category: category[idx]._id });
              lenField = field.length;
              const updateData = {
                  ...category[idx],
                  amount: lenField
              }
              listCategory.push(updateData)
          }

          res.render('vwCategoryAdmin/adCategory', {
              allCategory: listCategory,
              layout: 'layoutAdmin',
          });
      }).catch(next);
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
        fieldModel.find({ category: idCategory }).then(async (field) => {
            // console.log(field)

            field = JSON.parse(JSON.stringify(field))

            for (let idx = 0; idx < field.length; idx++) {
                cateName = field[0].category.name;
                cateDescrition = field[0].category.description;
                createDate = field[0].category.updatedAt;
                const courses = await courseModel.find({ field: field[idx]._id });
                lenCourse = courses.length;
                const updateData = {
                    ...field[idx],
                    amount: lenCourse
                }
                listField.push(updateData)
            }

            console.log(listField);
            res.render('vwCategoryAdmin/adField', {
                createDate,
                categoryDescrition: cateDescrition,
                categoryName: cateName,
                updateData: listField,
                layout: 'layoutAdmin',
            });
        }).catch(next);
    }),

    addCategory: catchAsync(async (req, res, next) => {
        // console.log(req.body);
        CategorySchema.create(req.body).then(() => {
            res.redirect('/admin');
        }).catch(() => {
            res.render('vwCategoryAdmin/adCategory', {
                layout: 'layoutAdmin'
            });
        })
    }),

    detail: catchAsync(async (req, res, next) => {
        const _idField = req.params.idField;
        console.log(_idField);
        var nameField;
        var descriptionField;
        var createedField;
        // const coursesCompleted = await Course.find({ createdBy: '63af9b69bbc55b73d3b1761e', status: 'completed' }).lean();

        courseModel.find({ field: _idField }).then(async (course) => {
            // console.log


            course = JSON.parse(JSON.stringify(course));
            course.map((el) => {
                el.ratingsNo = new Array(5 - Math.round((el.ratingsAverage))).fill(0);
                el.ratingsAverage = new Array(Math.round((el.ratingsAverage))).fill(0);
            });

            nameField = course[0].field.name;
            descriptionField = course[0].field.description;
            createedField = course[0].field.createdAt;
            console.log(nameField);

            res.render('vwCategoryAdmin/adDetailCategory', {
                layout: 'layoutAdmin',
                courses: course,
                nameField,
                descriptionField,
                createedField
            });
        }).catch(next);


    }),

    editCategory: catchAsync(async (req, res, next) => {
        var lenCourse;
        var listField = [];
        var categoryList;
        fieldModel.find().then(async (field) => {
            field = JSON.parse(JSON.stringify(field))
            for (let idx = 0; idx < field.length; idx++) {
                const courses = await courseModel.find({ field: field[idx]._id });
                categoryList = await CategorySchema.find();
                lenCourse = courses.length;
                const updateData = {
                    ...field[idx],
                    amount: lenCourse
                }
                listField.push(updateData);
            }

            // console.log(categoryList);
            res.render('vwCategoryAdmin/editCategory', {
                allField: listField,
                categoryLists: mongooseFeature.mutipleMongooseToObject(categoryList),
                layout: 'layoutAdmin',
            });
        }).catch(next);
    }),

    showUpdateField: catchAsync(async (req, res, next) => {
        const _idField = req.params.id;
        const categoryList = await CategorySchema.find();
        var idCate;
        fieldModel.findOne({ _id: _idField }).then(async (field) => {
            idCate = field.category._id;
            res.render('vwCategoryAdmin/adEditField', {
                categoryJSON: JSON.stringify(categoryList),
                idCategorySelected: idCate,
                FieldDeail: mongooseFeature.mongooseToObject(field),
                categorys: mongooseFeature.mutipleMongooseToObject(categoryList),
                layout: 'layoutAdmin',
            });
        }).catch(next);
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
            ...req.body
        }
        if (field) {
            return res.render('vwCategoryAdmin/adEditField', {
                categoryJSON: JSON.stringify(categoryList),
                layout: 'layoutAdmin',
                FieldDeail: data,
                idCategorySelected: idFieldSelected,
                category: req.body.category,
                categorys: mongooseFeature.mutipleMongooseToObject(categoryList),
                status: true
            });
        }

        fieldModel.findOneAndUpdate({ _id: id }, req.body)
            .then(() => {
                res.redirect('/admin/editCategory')
            })
            .catch(next);
    }),

    deleteField: catchAsync(async (req, res, next) => {
        const id = req.params.id;
        fieldModel.findByIdAndDelete({ _id: id }).then(() => res.redirect('back')).catch(next);
    })


};
