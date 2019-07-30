const express = require('express');
const router = express.Router();
const passport = require('passport');

const Hazard = require('../../models/Hazards');

// get Hazard with geospatial queries
// router.get('/',(req, res) => {
//   Hazard.find({})
// })

//create new hazard
router.post('/', (req, res) => {
  const newHazard = new Hazard({
    type: req.body.type,
    location: {
      type: req.body.location.type,
      coordinates: [req.body.location.longitude, req.body.location.latitude]
    }
  })

  newHazard.save()
    .then(hazard => res.json(hazard))
    .catch(err => res.json(err))
})

module.exports = router;