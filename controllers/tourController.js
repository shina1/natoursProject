const Tour = require('./../Model/tourModel');

// ---------------------creating the route-----------------------
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// middle ware for handling alias in the api
exports.aliasTopTour = (req,res,next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

class APIFeatures{
    constructor(query, queryString){
      this.query = query;
      this.queryString = queryString;
      // note that the req.query is the same with queryString
    }

  filter(){
     // 1a) Filtering
      const queryObj = {...this.queryString};
      // we exclude the el in the array below so as not to affect our filtering API
      const excludedFields = ['page','sort','limit','fields'];
      excludedFields.forEach(el => delete queryObj[el]);
      // 1b) Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|le)\b/g, match=>`$${match}`)
      this.query.find(JSON.parse(queryStr));
      return this;
  
  }
  sort(){
    //  2) Sorting
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }else{
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(){
    // 3) field limiting
    if(this.queryString.fields){
      const fields = this.queryString.fields.split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
    }else{
      this.query = this.query.select('-__v')
    }
    return this;
    }

    paggination(){
        // 4) Pagiation
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      if(req.query.page){
        const numTours = await Tour.countDocuments();
        if(skip >= numTours) throw new Error('This page does not exist');
      }
      return this;
    }
    
}

// route handlers for tours 
// i.e the handlers to perform all the crud operations
exports.getAllTours =async (req, res) => {
try {
  
  // build the query
 
//  execute the query
const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paggination();
  const toursData = await features.queryDB;
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
