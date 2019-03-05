
const mongoose = require('mongoose');

/* MongoDB Schema for store 'Data Provider' */
const dataProviderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true },
  url: { type: String, required: true },
  total: { type: Number, default: 0 },
  inserted_date: { type: Date, default: Date.now },
  updated_date: { type: Date },
  status: { type: Number , default: -1 }
});

dataProviderSchema.index( { 
  name: "text",
  url: "text"
 }, { name: 'dataproviders_index' });
 
module.exports = mongoose.model('DataProvider', dataProviderSchema);
