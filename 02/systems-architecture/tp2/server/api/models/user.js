const mongoose = require('mongoose');

/* MongoDB Schema for store 'User' */
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    match:  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  type: { type: String, enum: ['User', 'Admin', 'Func'] , default: "User" },
  password: { type: String, required: true },
  nif: { type: Number, required: true },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
