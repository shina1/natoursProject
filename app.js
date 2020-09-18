const express = require('express');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();
//------------------- middleware functions ------------------
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from the middleware function');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//-------------------- routes -----------------------------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
