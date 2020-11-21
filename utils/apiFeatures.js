// class for our API features
class APIFeatures{
    constructor(query, queryString){ 
      this.query = query;
      this.queryString = queryString;
      // note that the req.query is the same with queryString
    }
// filterig method
  filter(){
     // 1a) Filtering
      const queryObj = {...this.queryString};
      // we exclude the el in the array below so as not to affect our filtering API
      const excludedFields = ['page','sort','limit','fields'];
      excludedFields.forEach(el => delete queryObj[el]);
      // 1b) Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|le)\b/g, match=>`$${match}`)
      this.query.find(JSON.parse(queryStr));
      return this;
  
  }
  // sortig method
  sort(){
    //  2) Sorting
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }else{
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  // limiting method

  limitFields(){
    // 3) field limiting
    if(this.queryString.fields){
      const fields = this.queryString.fields.split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
    }else{
      this.query = this.query.select('-__v')
    }
    return this;
    }
// pagination method
    paggination(){
        // 4) Pagiation
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      // we dont really need this code because the fact that user request for a page and it does show means the page doesnt exist
      // if(this.queryString.page){
      //   const numTours = await Tour.countDocuments();
      //   if(skip >= numTours) throw new Error('This page does not exist');
      // }
      return this;
    }
    
}

module.exports = APIFeatures;