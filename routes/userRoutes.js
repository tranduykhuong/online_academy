import express from 'express';
import userController from '../controllers/userController.js';
import localMdw from '../middlewares/upload.mdw.js';
import authMdw from '../middlewares/auth.mdw.js';


const router = express.Router();

router.use(authMdw.protect)

router.route('/favorite/:id').get(userController.favorite);

router.route('/mycourse') 
  .get(userController.mycourse);
  
// router.get('/:id/edit', userController.edit);
// router.put('/:id', userController.update);
router.route('/profile').get(userController.show);
router.route('/profile/password')
.put(userController.changePassword);
router.route('/profile').put(
    localMdw.uploadAvtMdw,
    userController.update
);

export default router;