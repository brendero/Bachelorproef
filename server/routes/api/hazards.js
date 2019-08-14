const express = require('express');
const router = express.Router();
const passport = require('passport');

const Hazard = require('../../models/Hazards');

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

// report hazard using id
router.post('/report/:id', (req, res) => {
  Hazard.findById(req.params.id)
    .then(hazard => {
      if(hazard) {
        if(hazard.score - 1 === 0) {
          hazard.remove().then(() => res.json({success: true}))
        }
        else {
          Hazard.findByIdAndUpdate(hazard.id, {score: (hazard.score -1)}, {new: true})
          .then(hazardData => res.json(hazardData))
          .catch(err => res.status(404).json({success: false}))
        }
      }
    })
    .catch(err => res.json(err))
})

// Support hazard using id
router.post('/support/:id', (req, res) => {
  Hazard.findById(req.params.id)
    .then(hazard => {
      if(hazard) {
        Hazard.findByIdAndUpdate(hazard.id, {score: (hazard.score + 1)}, {new: true})
          .then(hazardData => res.json(hazardData))
          .catch(err => res.status(404).json({success: false}))
      }
    })
    .catch(err => res.json(err))
})

module.exports = router;