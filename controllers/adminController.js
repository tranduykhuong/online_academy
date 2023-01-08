import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import CategorySchema from '../models/category.model.js';
import fieldModel from '../models/field.model.js';
import mongooseFeature from '../utils/mongoose.js';
import courseModel from '../models/course.model.js';


export default {
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
