// const Tour = require("./Model/tourModel");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('DB connection succesfull ');
  });

// creating a document using function constructors
// this testTour document is an instance of the Tour model obviously and contains a couple of methods in it that we can use to interact with the database
// const testTour = new Tour({
//   name: 'The Road Rally3',
//   rating: 4.9,
//   price: 599,
// });
// save it to the database
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// console.log(process.env);
//------------------------ server --- ----------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
