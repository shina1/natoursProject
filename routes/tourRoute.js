const express = require('express');
const fs = require('fs');
const tourController = require('./../controllers/tourController');

// ---------------------creating the route-----------------------
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const Router = express.Router();

// Router.param('id', tourController.checkId);

Router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTuors);

Router.route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;
