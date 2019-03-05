const mongoose = require('mongoose');
const log4js = require('log4js');

const config = require('../../app.config');

/* Connect to MongoDB Atlas / local Server */
mongoose.connect(config.mongodb.connection + ":" + config.mongodb.port + "/" + config.mongodb.databaseName, { 
  useNewUrlParser: true , useCreateIndex: true
});


mongoose.connection.on('connected', () => { 
  console.log('Mongoose connected...');
  const log = log4js.getLogger('file');
  log.info(">> Mongoose connected...");
});
mongoose.connection.on('error', err => {
  console.log('Couldn´t connect to database! ', err);
  const log = log4js.getLogger('file');
  log.info(">> Couldn´t connect to database! " + err);
});
mongoose.connection.on('disconnected', () => { 
  console.log('Mongoose: connecntion disconnected! '); 
  const log = log4js.getLogger('file');
  log.info(">> Mongoose: connecntion disconnected! ");
});