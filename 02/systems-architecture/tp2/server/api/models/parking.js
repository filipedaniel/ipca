const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 

/* MongoDB Schema for store 'Parking' */
const parkingSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  location: {
    street: { type: String, required: [ true, "Missing 'street'!" ] },
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: []
    }
  },
  type: { type: String, enum: [ 'Normal' , 'Special', 'Transport', 'Electric' ], default: 'Normal' },
  taken: { type: Boolean, default: false }
});

parkingSchema.index({ 'location.coordinates': "2dsphere" });

module.exports = mongoose.model('Parking', parkingSchema);
