import express from 'express';
import userController from '../controllers/userController.js';
import localMdw from '../middlewares/locals.mdw.js';


const router = express.Router();

router.route('/favorite/:id').get(userController.favorite);
// router.get('/:id/edit', userController.edit);
// router.put('/:id', userController.update);
router.route('/:id').get(userController.show);
router.route('/:id').put(
    localMdw.uploadAvtMdw,
    userController.update
);
router.route('/:id/change_pass').patch(userController.changePassword);

export default router;