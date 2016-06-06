
// Dependencies
var express = require('express');
var router = express.Router();

//Product
var Appointment = require('./model');
Appointment.methods(['get', 'put', 'post', 'delete']);
Appointment.register(router, '/slots');

// Return router
module.exports = router;
