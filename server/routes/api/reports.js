const express = require('express');
const router = express.Router();
const passport = require('passport');

const Hazard = require('../../models/Hazards');

router.post('/', (req, res) => {
  const newHazard = new Hazard({
    // TODO: add properties
  })

  newHazard.save()
    .then(hazard => res.json(hazard))
    .catch(err => res.json(err))
})