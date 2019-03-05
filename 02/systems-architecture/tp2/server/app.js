const express = require("express");
var compression = require('compression');
const boom = require('boom');
var logger = require('morgan');
var path = require('path');

/*const log4js = require('log4js');
log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'logs/api/log.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' }}
});*/

/* Connection to mongodb */
let db =  require('./api/config/mongo');

// Adds middleware to express app to serve the Swagger UI bound to your Swagger document. 
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./public/apidoc-swagger/swagger.json');

const app = express();
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
/*app.set('public', path.join(__dirname, 'public'));
app.use(express.static('public'));*/

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS, PUT, DELETE"); 
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
}); */


/* Import API Routers */
var indexRouter = require('./api/routes/index');
var authRouter = require('./api/routes/auth');
var userRouter = require('./api/routes/user');
var cityRouter = require('./api/routes/city');
var parkingRouter = require('./api/routes/parking');
var managementRouter = require('./api/routes/management');
var carRouter = require('./api/routes/car');

/* App Router */
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/city', cityRouter);
app.use('/parking', parkingRouter);
app.use('/management', managementRouter);
app.use('/car', carRouter);
app.use('/apidoc-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/apidoc', express.static('public/apidoc'));

/* catch 404 and forward to error handler */
app.use((req, res, next) => {
  next(boom.notFound("Not found!"));
});

/* error handler */
app.use((err, req, res, next) => {
  //console.log(err);
  /*const logger = log4js.getLogger('file');
  logger.error(err.output.payload);*/
  res.status(err.output.statusCode || 500);
  res.json(err.output.payload);
});

module.exports = app;
