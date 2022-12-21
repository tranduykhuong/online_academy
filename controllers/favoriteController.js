import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
    favorite: catchAsync(async (req, res, next) => {
      res.render('vwFavorite/favorite', {
        layout: 'layout'
      })
    }),
};
