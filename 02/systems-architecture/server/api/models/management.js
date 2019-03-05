const mongoose = require('mongoose');

/* MongoDB Schema for store 'Management' */
const managementSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  parking: { type: mongoose.Schema.Types.ObjectId, ref: 'Parking' },
  entryTime: { type: Date, require: true },
  timeExpected: { type: Number, require: true },
  valueExpected: { type: Number, require: true },
  exitTimeExpected: { type: Date, require: true },
  exitTime: { type: Date },
  fee: { type: Number, default: 0 },
  value: { type: Number, require: true }
});

module.exports = mongoose.model('Management', managementSchema);
