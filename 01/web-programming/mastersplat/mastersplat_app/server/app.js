var createError = require('http-errors');
var compression = require('compression')
var express = require('express');
var path = require('path');
var logger = require('morgan');

// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');

// Loads environment variables from a .env file into process.env
require('dotenv').config();

// Adds middleware to express app to serve the Swagger UI bound to your Swagger document. 
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./docs/swagger.json');

// Import API Routers
var indexRouter = require('./api/routes/index');
var dataProvidersRouter = require('./api/routes/dataProviders');
var publicationRouter = require('./api/routes/publications');
var logsRouter = require('./api/routes/logs');


// Connect to MongoDB Atlas Server or localhost
mongoose.connect('mongodb://localhost:27017/masterplat');


var app = express();

app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


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

// App Router
app.use('/', indexRouter);
app.use('/api/v1/data-providers', dataProvidersRouter);
app.use('/api/v1/publications', publicationRouter);
app.use('/api/v1/logs', logsRouter);

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
