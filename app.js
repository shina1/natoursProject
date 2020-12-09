const express = require('express');

const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorConnntroller');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();
//------------------- middleware functions ------------------
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//-------------------- routes -----------------------------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// error handler for routes
app.all('*',(req,res, next)=>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// a global error handling middel ware.
 app.use(globalErrorHandler)
module.exports = app;
