const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// the tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //this is a validator
    unique: true,
    trim:true,
    maxlength: [40,'A tour name must have less or equal tha 40 characters'],
    minlength:[10, 'A tour name must have more or equal than 10 characters'],
    // validate: [validator.isAlpha, 'Tour name must be a alphabet']
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
    required:[true, "Tour must have a dificulty"],
    enum: {
      values: ['easy', 'medium', 'difficulty'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage:{
    type: Number,
    default: 4.5,
    min: [1, 'Ratings must be above 1.0'],
    max: [5, 'Ratings must be below 5.0']
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
  priceDiscount: {
    type:Number,
    validate: {
      validator: function(val){
        //this only points to current doc on the document creation.
        return val < this.price; 
      },
      message:'Price discount ({VALUE}) can not be more than the actual price' 
    }
  },
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
  startDates:[Date],
    secreteTour:{
      type:Boolean,
      default: false,
    }
  
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

tourSchema.pre(/^find/, function(next){
this.find({secreteTour: {$ne : true}});

this.start = Date.now();
next();
});

tourSchema.post(/^find/, function(doc,next){
  console.log(`Query took ${Date.now() - this.start } milliseconds`);
  
  next();
})

// aggreagation middlerware
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match: {secreteTour: {$ne: true}}})
  next();
});

// the tour model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
