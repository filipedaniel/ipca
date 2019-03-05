
const mongoose = require('mongoose');

/* MongoDB Schema for store 'Logs' */
const logSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  start_date: { type: Date, default: Date.now },
  end_date: {type: Date, required: true },
  data_provider: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true }
  },
  total_records: { type: Number, required: true }
});

logSchema.index( { 
  "data_provider.name": "text",
  "data_provider.url": "text"
 },{ name: 'logs_index' });

module.exports = mongoose.model('Log', logSchema);