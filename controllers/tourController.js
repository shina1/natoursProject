const Tour = require('./../Model/tourModel');

// ---------------------creating the route-----------------------
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// route handlers for tours 
// i.e the handlers to perform all the crud operations
exports.getAllTours =async (req, res) => {
try {
  
  // build the query
  // 1a) Filtering
  const queryObj = {...req.query};
  // we exclude the el in the array below so as not to affect our filtering API
  const excludedFields = ['page','sort','limit','fields'];
 excludedFields.forEach(el => delete queryObj[el]);
// 1b) Advanced Filtering
let queryStr = JSON.stringify(queryObj);
queryStr = queryStr.replace(/\b(gte|gt|lte|le)\b/g, match=>`$${match}`)

 let queryDB =  Tour.find(JSON.parse(queryStr));
//  remeber Tour.find(JSON.parse(queryStr)) will always return a query
//  2) Sorting
if(req.query.sort){
  const sortBy = req.query.sort.split(",").join(" ");
  queryDB = queryDB.sort(sortBy);
}else{
  queryDB = queryDB.sort('-createdAt');
}
// 3) field limiting
if(req.query.fields){
  const fields = req.query.fields.split(",").join(" ");
  console.log(fields);
  queryDB = queryDB.select(fields);
}else{
  queryDB = queryDB.select('-__v')
}
// 4) Pagiation
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 100;
const skip = (page - 1) * limit;

queryDB = queryDB.skip(skip).limit(limit);
if(req.query.page){
  const numTours = await Tour.countDocuments();
  if(skip >= numTours) throw new Error('This page does not exist');
}
//  execute the query
  const toursData = await queryDB;
  // send response
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
