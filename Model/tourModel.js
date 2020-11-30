const mongoose = require('mongoose');
const slugify = require('slugify');

// the tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //this is a validator
    unique: true,
    trim:true
  },
  
   slug: String 
  ,
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
  startDates:[Date]
},{
  toJSON : {virtuals: true},
  toObject : {virtual: true}
});



// virtual properties
// These are properties/fields that are defined on the schema but ot persisted(saved to the database). 
// They most suited for fields that can be derived from one another.
tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
})
// mongoose document middleware: runs before the .save() command and the .create() command but not on .insertMany
tourSchema.pre('save', function(next){
this.slug = slugify(this.name, {lower:true});
next();
});

// a post document meddileware
// note that we no longer have the 'this' keyword bercause the documnet has already been saved to the database.
// tourSchema.post('save', function(doc,next){
// console.log(doc);
// next();
// });




// the tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
