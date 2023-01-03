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

import livereload from "livereload";
import connectLiveReload from "connect-livereload";

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import authRoutes from './routes/authRoutes.js';
import settings from './routes/profileRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studyRoutes from './routes/studyRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import adCategorySideBar from './routes/adminRoutes.js';

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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
    }
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

// ROUTES
app.get('/', (req, res) => {
  res.redirect('/home');
});
app.get('/home', (req, res) => {
  res.render('home');
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/study', studyRoutes);
app.use('/course', courseRoutes);

//Admin
app.use('/adCategorySideBar', adCategorySideBar);

// app.get('/teacher/addCourse', (req, res) => res.render('teacher/addCourse'))

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app;
