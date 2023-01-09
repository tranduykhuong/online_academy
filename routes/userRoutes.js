import express from 'express';
import userController from '../controllers/userController.js';
import localMdw from '../middlewares/upload.mdw.js';


const router = express.Router();

router.route('/favorite').get(userController.favorite);

router.route('/mycourse') 
  .get(userController.mycourse);
  
// router.get('/:id/edit', userController.edit);
// router.put('/:id', userController.update);
router.route('/:id').get(userController.show);
router.route('/:id').put(
    localMdw.uploadAvtMdw,
    userController.update
);
router.route('/:id/change_pass').patch(userController.changePassword);

export default router;