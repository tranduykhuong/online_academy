import express from 'express';

const router = express.Router();

router.route('/profile')
  .get((req, res, next) => {
    res.render('settings/profiles');
  })
export default router;