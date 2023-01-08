import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import mongoose from '../utils/mongoose.js';
import Course from '../models/course.model.js';
import Field from '../models/field.model.js';
import category from '../models/category.model.js';
import User from '../models/user.model.js';




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
    })

};
