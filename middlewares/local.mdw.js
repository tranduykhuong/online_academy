export default function (app) {
  app.use(async function (req, res, next) {
    if (res.locals.user) {
     req.session.user = res.locals.user;
    }
    next();
   });

 app.use(async function (req, res, next) {
  if (typeof req.session.user === 'undefined') {
   req.session.user = false;
  }
  res.locals.user = req.session.user;
  next();
 });
}
