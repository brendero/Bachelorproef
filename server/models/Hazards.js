const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HazardSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['tram','busystreet','obstruction','badbikepath','highcurb','intersection','badroad','other']
  },
  location: {
    type: {
      type: String,
      required: true
    },
    coordinates: [
      // Longitude first (between -180 and 180)
      Number,
      // Latitude secondly (between -90 and 90)
      Number
     ]
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = Hazard = mongoose.model('Hazard', HazardSchema);
