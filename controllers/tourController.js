
const { aggregate } = require('./../Model/tourModel');
const Tour = require('./../Model/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
exports.getAllTours = catchAsync(
  async (req, res,next) => {
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
  
  }
);


exports.createTuors = catchAsync(
  async (req, res ,next) => {
    // const newTours = new Tour({});
     // newTours.save()
     const newTours = await Tour.create(req.body);
 
     res.status(201).json({
       status: 'success',
       data: {
         tours: newTours,
       },
     });
 }
);
exports.getTourById = catchAsync(
  async(req, res,next) => {
    // const tourId = toursData.find((el) => el.id === id);    
      

      const tourId = await Tour.findById(req.params.id);
      if(!tourId){
        return  next(new AppError('No tour found with that ID', 404))
       }
       res.status(200).json({
      status: 'success',
      data: {
        tours: tourId,
      },
    });
  }
);

exports.updateTour = catchAsync(
  async  (req, res,next) => {
    const toursUpdate = await Tour.findByIdAndUpdate(req.params.id, req.body,{
     new: true,
     runValidators:true
    });

    if(!tourId){
      return  next(new AppError('No tour found with that ID', 404))
     }

    res.status(200).json({
      status: 'success',
      data: {
        tours: toursUpdate,
      },
    });
}
); 

exports.deleteTour = catchAsync(
  async(req, res,next) => { 
    const tourDelete = await Tour.findByIdAndDelete(req.params.id);

    if(!tourId){
      return  next(new AppError('No tour found with that ID', 404))
     }
     
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
); 

// handler fuction for agregation pipeline
// note this will retur a aggregate object


exports.getMonthlyPlan = catchAsync(
  async (req, res,next)=>{
  
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
  
}
);

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
// }catchAsync


exports.getTourStats =catchAsync(
  async (req, res,next)=>{
  
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
);