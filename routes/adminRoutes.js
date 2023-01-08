import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.route('/editCategory').get(adminController.editCategory);
router.route('/editCategory/:id').post(adminController.deleteField);
router.route('/is-available').get(adminController.isAvailable);

router.route('/:id/edit').get(adminController.showUpdateField);
router.route('/:id/edit').put(adminController.updateField);

router.route('/:id/:idField').get(adminController.detail);
router.route('/:id').get(adminController.listField);
router.route('/').post(adminController.addCategory);
router.route('/').get(adminController.adCategory);


export default router;