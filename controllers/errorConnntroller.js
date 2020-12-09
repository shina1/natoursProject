const AppError = require('./../utils/appError');
// note that these errors are those from mongoose in production mode.
//  function for handling CastError from the database
const handleCastErrorDB = (err)=>{
const message = `Invalid ${err.path}: ${err.value}.`;
return new AppError(message, 400);
};

//  fuction for handling duplicate fields from the database
const handleDuplicateFieldDB = (err)=>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
const message = `Duplicate field value: ${value}. Please use another value!`;
return AppError(message, 400);
};
// function for handling validation error from db
const handleValidationErrorDB = (err)=>{
  const errors = Object.values(err.errors).map(el =>{
    el.message;
  })
const message = `Ivalid input data. ${errors.join('. ')}`;
return AppError(message, 400); 
}

// error handler for development mode
const sendErrDev = (err, res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}
// error handler for production mode

const sendErrProd = (err, res)=>{
  //Operational trusted error: sed message to the client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //Programming or other error: dont leak error detials to the client
  else{
    //1) Log error
    console.error('ERROR', err);

    //2) Send generated message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
  
};

module.exports = (err,req,res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  if(process.env.NODE_ENV === 'development'){
    sendErrDev(err, res);
  }else if(process.env.NODE_ENV === 'production'){
    let error = {...err};
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldDB(error);
    if(error.name === 'validationError') error = handleValidationErrorDB(error);

    sendErrProd(error, res);
  }
 };