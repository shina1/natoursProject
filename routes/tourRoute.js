const express = require('express');
const fs = require('fs');
const tourController = require('./../controllers/tourController');

// ---------------------creating the route-----------------------
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const Router = express.Router();

// Router.param('id', tourController.checkId);
Router.route('/top-5-cheap').get(tourController.aliasCheapTour, tourController.getAllTours); 
Router.route('/top-5-exclusive').get(tourController.aliasTopTour, tourController.getAllTours);
Router.route('/tour-stats').get(tourController.getTourStats);
Router.route('/tour-monthly-plan/:year').get(tourController.getMonthlyPlan);

Router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTuors);

Router.route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;
