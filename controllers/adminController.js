import { Error } from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

export default {
 adCategory: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adCategorySideBar', {
   layout: 'layoutAdmin',
  });
 }),

 adCategoryMobile: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adCategoryMobile', {
   layout: 'layoutAdmin',
  });
 }),

 adCategoryWeb: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adCategoryWeb', {
   layout: 'layoutAdmin',
  });
 }),
 editCategory: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/editCategory', {
   layout: 'layoutAdmin',
  });
 }),
 detail: catchAsync(async (req, res, next) => {
  res.render('vwCategoryAdmin/adDetailCategory', {
   layout: 'layoutAdmin',
  });
 }),
};
