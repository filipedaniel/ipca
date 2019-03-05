const mongoose = require('mongoose');

const UserSchema = require('./user').schema;

/* MongoDB Schema for store 'Car' */
const carSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  registration: { type: String, require: true },
  type: { type: String, enum: [ 'Normal' , 'Special', 'Transport', 'Electric' ], default: 'Normal' },
  user: UserSchema
});

module.exports = mongoose.model('Car', carSchema);
