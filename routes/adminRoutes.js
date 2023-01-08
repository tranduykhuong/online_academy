import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.route('/categoryMobile').get(adminController.adCategoryMobile);
router.route('/categoryWeb').get(adminController.adCategoryWeb);
router.route('/editCategory').get(adminController.editCategory);
router.route('/detail').get(adminController.detail);
router.route('/dashboard/acceptrequest/:idrequest').post(adminController.acceptrequest);
router.route('/dashboard/removerequest/:idrequest').post(adminController.removerequest);
router.route('/dashboard/removecourse/:idcourse').post(adminController.removecourse);
router.route('/dashboard/acceptcourse/:idcourse').post(adminController.acceptcourse);
router.route('/dashboard').get(adminController.dashboard);
router.route('/deletecourse/disabled/:idcourse').post(adminController.dsbcourse)
router.route('/deletecourse/:idcourse').post(adminController.dltcourse);
router.route('/deletecourse').get(adminController.deletecourse);
router.route('/').get(adminController.adCategory);


export default router;