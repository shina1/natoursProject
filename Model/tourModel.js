const mongoose = require('mongoose');

// the tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //this is a validator
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// the tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
