const mongoose = require('mongoose');

/* MongoDB Schema for store 'City' */
const citySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  description: { type: String, required: [ true, "Missing city 'description'!" ] },
  price: { type: Number, require: [true, "Missing city 'price' €/min !"] },
  fee: { type: Number, default: 0.05 }
});

module.exports = mongoose.model('City', citySchema);
