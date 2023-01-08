import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.route('/editCategory').get(adminController.editCategory);
router.route('/detail').get(adminController.detail);

//teacher admin
router.route('/allTeachers').get(adminController.allTeacher);
router.route('/addTeacher').get(adminController.addTeacher);
// router.route('/editTeacher').get(adminController.editTeacher);
router.route('/teacherProfile').get(adminController.teacherProfile);

//studennt admin
router.route('/delStudent').post(adminController.deleteStudent);
router.route('/addStudent/add').post(adminController.addNewStudent);
router.route('/allStudents').get(adminController.allStudents);
router.route('/addStudent').get(adminController.addStudent);
router.route('/studentProfile').get(adminController.studentProfile);

router.route('/editCategory/:id').post(adminController.deleteField);
router.route('/is-available').get(adminController.isAvailable);


router.route('/detail').get(adminController.detail);
router.route('/dashboard/acceptrequest/:idrequest').post(adminController.acceptrequest);
router.route('/dashboard/removerequest/:idrequest').post(adminController.removerequest);
router.route('/dashboard/removecourse/:idcourse').post(adminController.removecourse);
router.route('/dashboard/acceptcourse/:idcourse').post(adminController.acceptcourse);
router.route('/dashboard').get(adminController.dashboard);
router.route('/deletecourse/disabled/:idcourse').post(adminController.dsbcourse)
router.route('/deletecourse/:idcourse').post(adminController.dltcourse);
router.route('/deletecourse').get(adminController.deletecourse);

router.route('/editTeacher').get(adminController.editTeacher);
router.route('/editStudent').get(adminController.editStudent);

router.route('/:id/edit').get(adminController.showUpdateField);
router.route('/:id/edit').put(adminController.updateField);

router.route('/:id/:idField').get(adminController.detail);
router.route('/:id').get(adminController.listField);
router.route('/').get(adminController.adCategory);
router.route('/').post(adminController.addCategory);




export default router;