const fs = require('fs');

// ---------------------creating the route-----------------------
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//  route handlers for users

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error',
  });
};

exports.createUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error,Request not found',
  });
};

exports.getUsers = (req, res) => {
  const id = req.params.id * 1;
  if (id > toursData.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error,Request not found',
  });
};

exports.updateUsers = (req, res) => {
  const id = req.params.id * 1;
  if (id > toursData.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error,Request not found',
  });
};

exports.deleteUsers = (req, res) => {
  const id = req.params.id * 1;
  if (id > toursData.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  res.status(500).json({
    status: 'Error',
    message: 'Internal server error,Request not found',
  });
};
