import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
  adCategory: catchAsync(async (req, res, next) => {
    res.render('vwCategoryAdmin/adCategorySideBar', {
      layout: 'layout'
    })
  }),

  adCategoryMobile: catchAsync(async (req, res, next) => {
    res.render('vwCategoryAdmin/adCategoryMobile', {
      layout: 'layout'
    })
  }),

  adCategoryWeb: catchAsync(async (req, res, next) => {
    res.render('vwCategoryAdmin/adCategoryWeb', {
      layout: 'layout'
    })
  }),
  editCategory: catchAsync(async (req, res, next) => {
    res.render('vwCategoryAdmin/editCategory', {
      layout: 'layout'
    })
  }),
  detail: catchAsync(async (req, res, next) => {
    res.render('vwCategoryAdmin/adDetailCategory', {
      layout: 'layout'
    })
  })
};