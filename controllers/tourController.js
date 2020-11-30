const { aggregate } = require('./../Model/tourModel');
const Tour = require('./../Model/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// ---------------------creating the route-----------------------
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
// middle ware for handling alias in the api
exports.aliasCheapTour = (req,res,next)=>{
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}
exports.aliasTopTour = (req,res,next)=>{
  req.query.limit = '5';
  req.query.sort = '-price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty,images';
  next();
}



// route handlers for tours 
// i.e the handlers to perform all the crud operations
exports.getAllTours =async (req, res) => {
try {
  
  // build the query
 
//  execute the query
const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paggination();
  const toursData = await features.query;
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

// handler fuction for agregation pipeline
// note this will retur a aggregate object


exports.getMonthlyPlan = async (req, res)=>{
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match:{
          startDates: {
            $gte:new Date(`${year}-01-01`), 
            $lte:new Date(`${year}-12-31`), 
            
          }
        }
      },
      {
        $group:{
          _id: {$month: '$startDates'},
          numTours: {$sum : 1},
          tours: {$push: '$name'},
          price: {$sum:'$price'}
        }
      },
      {
        $addFields:{month:'$_id'}
      },
      {
        $project:{
          _id:0
        }
      },
      {
        $sort:{
          numTours: -1
        }
      },
      {
        $limit : 12
      }
      
    ]);

    res.status(200).json({
      status: 'success',
      data:{
        plan
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    })
  }
}

// aggregation pipeline

// exports.getTourStarts = async(req,res)=>{
//   try{
//     const stats = await Tour.aggregate([
//       {
//         $match: {ratingsAverage:{$gte: 4.5}}
//       },
//       {
//         $group:{
//           _id:null,
//           avgRating: {$avg:'$ratingsAverage'},
//           avgPrice: {$avg:'$price'},
//           minPrice: {$min: '$price'},
//           maxPrice: {$max: '$price'}
//         }
//       }
//     ]);
//     res.status(200).json({
//       status:'success',
//       data:{
//         stats
//       }
//     })
//   }
//   catch (err){
// res.status(404).json({
//   status: 'fail',
//   message: err
// })
//   }
// }


exports.getTourStats = async (req, res)=>{
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {$gte: 4.5}
        }
      },
      {
        $group: {
          _id:{$toUpper: '$difficulty'},
          numTours: {$sum: 1},
          numRating : {$sum: '$ratingsAverage'},
          avgRatings: { $avg:'$ratingsAverage'},
          avgPrice : {$avg : '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max:'$price'}
        }
      },
      {
        $sort:{
          avgPrice: 1
        }
      }
      
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  }
   catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
  }