import express from 'express';
import adCategoryController from '../controllers/adCategorySideBar.js';

const router = express.Router();

router.route('/adCategoryMobile').get(adCategoryController.adCategoryMobile);
router.route('/adCategoryWeb').get(adCategoryController.adCategoryWeb);
router.route('/editCategory').get(adCategoryController.editCategory);
router.route('/detail').get(adCategoryController.detail);
router.route('/').get(adCategoryController.adCategory);


export default router;