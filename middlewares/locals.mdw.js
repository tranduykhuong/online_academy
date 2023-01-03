import catchAsync from '../utils/catchAsync.js';
import multer from 'multer';
import urid from 'urid';
import fs from 'fs';

export default {
 uploadMdw: catchAsync(async (req, res, next) => {
  const storage = await multer.diskStorage({
   destination: function (req, file, cb) {
    if (file.fieldname.includes('image')) {
     cb(null, './public/courses/imgs');
    } else if (file.fieldname.includes('video')) {
     cb(null, './public/courses/videos');
    }
   },

   filename: function (req, file, cb) {
    if (file.fieldname.includes('image')) {
     const arr = file.originalname.split('.');
     const filename = urid() + '-' + Date.now() + '.' + arr[arr.length - 1];
     cb(null, filename);

     if (file.fieldname === 'image') {
      if (req.session.image) {
       fs.unlinkSync(req.session.image);
      }
      req.session.image = './public/courses/imgs/' + filename;
     } else {
      const filecat = file.fieldname.split('|');
      const oldUrl = req.session.chapter[parseInt(filecat[0]) - 1].listVideo[parseInt(filecat[2] - 1)].avtVideo;
      if (oldUrl !== '') {
       fs.unlinkSync(oldUrl);
      }
      req.session.chapter[parseInt(filecat[0]) - 1].listVideo[parseInt(filecat[2] - 1)].avtVideo = './public/courses/imgs/' + filename;
     }
    } else if (file.fieldname.includes('video')) {
     const arr = file.originalname.split('.');
     const filename = urid() + '-' + Date.now() + '.' + arr[arr.length - 1];
     cb(null, filename);

     if (file.fieldname === 'videoDemo') {
      if (req.session.videoDemo) {
       fs.unlinkSync(req.session.videoDemo);
      }
      req.session.videoDemo = './public/courses/videos/' + filename;
     } else {
      const filecat = file.fieldname.split('|');
      const oldUrl = req.session.chapter[parseInt(filecat[0]) - 1].listVideo[parseInt(filecat[2] - 1)].urlVideo;
      if (oldUrl !== '') {
       fs.unlinkSync(oldUrl);
      }
      req.session.chapter[parseInt(filecat[0]) - 1].listVideo[parseInt(filecat[2] - 1)].urlVideo = './public/courses/videos/' + filename;
     }
    }
    // console.log(req.session.chapter[0].listVideo);
   },
  });
  const upload = multer({ storage: storage });

  if (!req.session.fields) {
   req.session.fields = [
    {
     name: 'image',
     maxCount: 1,
    },
    {
     name: 'videoDemo',
     maxCount: 1,
    },
    {
     name: '1|image|1',
     maxCount: 1,
    },
    {
     name: '1|video|1',
     maxCount: 1,
    },
   ];
  }

  await upload.fields(req.session.fields)(req, res, function (err) {
   if (err) {
    console.log(err);
   }
   next();
  });
 }),
};
