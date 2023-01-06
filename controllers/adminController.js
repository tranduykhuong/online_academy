import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

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
        res.render('vwTeacherAdmin/all-professors', {
            layout: 'layoutAdmin',
        });
    }),
    addTeacher: catchAsync(async (req, res, next) => {
        res.render('vwTeacherAdmin/add-professor', {
            layout: 'layoutAdmin',
        });
    }),
    editTeacher: catchAsync(async (req, res, next) => {
        res.render('vwTeacherAdmin/edit-professor', {
            layout: 'layoutAdmin',
        });
    }),
    profileTeacher: catchAsync(async (req, res, next) => {
        res.render('vwStudentAdmin/all-student', {
            layout: 'layoutAdmin',
        });
    }),
    //student
    allStudents: catchAsync(async (req, res, next) => {
        res.render('vwStudentAdmin/all-students', {
            layout: 'layoutAdmin',
        });
    }),
    addStudent: catchAsync(async (req, res, next) => {
        res.render('vwStudentAdmin/add-student', {
            layout: 'layoutAdmin',
        });
    }),
    editStudent: catchAsync(async (req, res, next) => {
        res.render('vwStudentAdmin/edit-student', {
            layout: 'layoutAdmin',
        });
    }),
    studentProfile: catchAsync(async (req, res, next) => {
        res.render('vwStudentAdmin/about-student', {
            layout: 'layoutAdmin',
        });
    }),

};
