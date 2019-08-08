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
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  score: {
    type: Number,
    required: true,
    default: 10
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = Hazard = mongoose.model('Hazard', HazardSchema);
