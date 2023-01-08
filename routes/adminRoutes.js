import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.route('/categoryMobile').get(adminController.adCategoryMobile);
router.route('/categoryWeb').get(adminController.adCategoryWeb);
router.route('/editCategory').get(adminController.editCategory);
router.route('/detail').get(adminController.detail);

//teacher admin
router.route('/allTeachers').get(adminController.allTeacher);
router.route('/addTeacher').get(adminController.addTeacher);
// router.route('/editTeacher').get(adminController.editTeacher);
router.route('/teacherProfile').get(adminController.addTeacher);

//studennt admin
router.route('/delStudent').post(adminController.deleteStudent);
router.route('/addStudent/add').post(adminController.addNewStudent);
router.route('/allStudents').get(adminController.allStudents);
router.route('/addStudent').get(adminController.addStudent);
router.route('/studentProfile').get(adminController.studentProfile);

router.route('/').get(adminController.adCategory);

router.route('/editTeacher').get(adminController.editTeacher);
router.route('/editStudent').get(adminController.editStudent);




export default router;