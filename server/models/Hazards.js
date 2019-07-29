const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  location: {
    lat: {
      type: String,
      required: true
    },
    lng: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = Report = mongoose.model('Report', ReportSchema);
