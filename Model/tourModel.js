const mongoose = require('mongoose');

// the tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //this is a validator
    unique: true,
    trim:true
  },
  duration :{
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required:[true, "Tour mjust have a group size"]
  },
  difficulty:{
    type: String,
    required:[true, "Tour must have a dificulty"]
  },
  ratingsAverage:{
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  // rating: {
  //   type: Number,
  //   default: 4.5,
  // },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary:{
    type:String,
    trim:true,
    required:[true, "A tour must have a description"]
  },
  description:{
    type: String,
    trim:true
  },
  imageCover:{
    type: String,
    required: [true, "A tour must have a cover image"]
  },
  images:[String],
  createdAt:{
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});
// the tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
