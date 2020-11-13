const Tour = require('./../Model/tourModel');

// ---------------------creating the route-----------------------
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// route handlers for tours
exports.getAllTours =async (req, res) => {
try {
  console.log(req.query);
  const toursData = await Tour.find();
  res.status(200).json({
    status: 'success',
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
} catch (err) {
  res.status(404).json({
    status: "failed",
    message : err
  })
  
}
};

exports.createTuors = async (req, res) => {
  try {
    // const newTours = new Tour({});
    // newTours.save()
    const newTours = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tours: newTours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
exports.getTourById = async(req, res) => {
  console.log(req.params.id)
  // const tourId = toursData.find((el) => el.id === id);

  try {
    
    const tourId = await Tour.findById(req.params.id)
     res.status(200).json({
    status: 'success',
    data: {
      tours: tourId,
    },
  });
    
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
 
};

exports.updateTour = async  (req, res) => {
  try {
    const toursUpdate = Tour.findByIdAndUpdate(req.params.id, req.body,{
     new: true,
     runValidators:true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tours: toursUpdate,
      },
    });
  } catch (err) {
    res.status(404).json({
      status:"fail",
      message: err
    })
  }
  
};

exports.deleteTour = async(req, res) => {
try {
 
  const tourDelete = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
} catch (err) {
  res.status(404).json({
    status: "fail",
    message: err
  })
}
};
