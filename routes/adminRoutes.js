import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.route('/categoryMobile').get(adminController.adCategoryMobile);
router.route('/categoryWeb').get(adminController.adCategoryWeb);
router.route('/editCategory').get(adminController.editCategory);
router.route('/detail').get(adminController.detail);
router.route('/').get(adminController.adCategory);


export default router;