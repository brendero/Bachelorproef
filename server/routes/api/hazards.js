const express = require('express');
const router = express.Router();
const passport = require('passport');

const Hazard = require('../../models/Hazards');

//Test
// get Hazard with geospatial queries
router.get('/testsearch',(req, res) => {
  const coordinatesJson = JSON.parse(req.query.coordinates);
  Hazard.find({ location: { 
    $geoIntersects : { 
      $geometry: {
        type: "Point",
        coordinates: [coordinatesJson]
      },
      $maxDistance: 100
    }
  }})
  .then(hazards => {
    if(hazards) {
      res.json(hazards)
    } else {
      res.status(404).json({success: false})
    }
  })
  .catch(err => res.status(404).json(err))
})


// get Hazard with geospatial queries
router.get('/search',(req, res) => {
  const coordinatesJson = JSON.parse(req.query.coordinates);
  Hazard.find({ location: { 
    $nearSphere : { 
      $geometry: {
        type: "Point",
        coordinates: [coordinatesJson.longitude, coordinatesJson.latitude]
      },
      $maxDistance: 100
    }
  }})
  .then(hazards => {
    if(hazards) {
      res.json(hazards)
    } else {
      res.status(404).json({success: false})
    }
  })
  .catch(err => res.status(404).json(err))
})

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