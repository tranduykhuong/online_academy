import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
    video: catchAsync(async (req, res, next) => {
      res.render('vwviewVideo/viewVideo', {
        layout: 'layoutEmpty'
      })
    }),
};
