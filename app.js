import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections'
import numeral from 'numeral';
import path from 'path';
import {fileURLToPath} from 'url';
import morgan from 'morgan';

import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import Course from './models/course.model.js';
import Field from './models/field.model.js';
import cookieParser from 'cookie-parser';

import methodOverride from "method-override"

import ativate_locals from './middlewares/local.mdw.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studyRoutes from './routes/studyRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import adCategorySideBar from './routes/adminRoutes.js';
import homeRouter from './routes/homeRoutes.js'

import courseModel from './models/course.model.js';

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try this again in an hour!',
});

const app = express();
app.use(cors());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// app.use(morgan('combined'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '/public')));

// LISTENER HANDLEBARS CHANGE
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLiveReload());

// VIEW ENGINE
app.engine('hbs', engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  helpers: {
    section: hbs_sections(),
    format_number(val) {
      return numeral(val).format('0,0');
    },
    formatData(a) {
      return a.toLocaleString().substring(0, 10);
    },
    getDate(date) {
      return date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }).toString().split(",")[0];
    },
    sum: (a, b) => a + b,
    divide: (a, b) => (100 - Math.round(((a/b) * 100))),
    divide1: (a, b) => (Math.round(((a/b) * 100))),
    formatData(a){
      return a.toLocaleString().substring(0, 10);
    },
    sumk: (a) => (a + 1),
    getTime(date){
        return date.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}).toString().split(",")[1];
    },
    getDate(date){
      return date.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}).toString().split(",")[0];
    },
    numberWithDot(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    changeTime(secs){
      var sec_num = parseInt(secs, 10)
      var hours   = Math.floor(sec_num / 3600)
      var minutes = Math.floor(sec_num / 60) % 60
      var seconds = sec_num % 60
  
      return [hours,minutes,seconds]
          .map(v => v < 10 ? "0" + v : v)
          .filter((v,i) => v !== "00" || i > 0)
          .join(":")
    },
    formatTime(time){
      var stringtime = time.toString();
      if(stringtime.length <= 5)
      {
        var finalTime = stringtime.split(":");
        return finalTime[0] + " phút " + finalTime[1] + " giây";
      }
      else
      {
        var finalTime1 = stringtime.split(":");
        return finalTime1[0] + " giờ " + finalTime1[1] + " phút ";
      }
    },
    addOne(a){
      return a + 1;
    },
    changeURLVideo(url){
      return url.substring(8, url.length);
    },
    getTime(date){
      return date.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}).toString().split(",")[1];
    },
    getDate(date){
    return date.toLocaleString("en-US", {timeZone: "Asia/Bangkok"}).toString().split(",")[0];
  },
  }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true
  }
}))

app.use(flash());

//SEARCH
app.post('/searchfood/:searchValue', async (req, res) => {
  console.log(req.params.searchValue);
  var filterfood = req.params.searchValue.trim();
  await courseModel.find({ name: filterfood}).then(course => {
    console.log(course);
  })
})

app.use(cookieParser())
ativate_locals(app);
// ROUTES
app.get('/', (req, res) => {
  res.redirect('/home');
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/study', studyRoutes);
app.use('/course', courseRoutes);
app.use('/home', homeRouter);

//Admin
app.use('/adCategorySideBar', adCategorySideBar);

// app.get('/teacher/addCourse', (req, res) => res.render('teacher/addCourse'))

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app;
