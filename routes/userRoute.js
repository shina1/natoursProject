const express = require('express');

const userController = require('./../controllers/userController');
const Router = express.Router();

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);

Router.route('/:id')
  .get(userController.getUsers)
  .patch(userController.updateUsers)
  .delete(userController.deleteUsers);

module.exports = Router;
