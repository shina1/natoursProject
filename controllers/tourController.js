const fs = require('fs');

// ---------------------creating the route-----------------------
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Failed',
      message: 'name or price does not exist',
    });
  }

  next();
};

exports.checkId = (req, res, next, val) => {
  console.log(`the id is ${val}`);

  const id = req.params.id * 1;
  const tourId = toursData.find((el) => el.id === id);
  // if (id > toursData.length)
  if (!tourId) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID',
    });
  }
  next();
};
// route handlers for tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

exports.createTuors = (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTours = Object.assign({ id: newId }, req.body);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTours,
        },
      });
    }
  );
};
exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tourId = toursData.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',

    data: {
      tours: tourId,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
