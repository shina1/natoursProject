const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../Model/tourModel');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection succesfull ');
  });

//   read json file.

const tours =JSON.parse( fs.readFileSync(`${__dirname}/tours-simple.json`, 'UTF-8'));

// import data into database

const importData = async ()=>{
    try {
        await Tour.create(tours);
        console.log("mo ti ko gbogbo data si inu apo data ");
        
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// to delete all dat from database
const deleteData = async ()=>{
    try {
       await Tour.deleteMany();
       console.log("mo ti delete gbogbo re fa!");
       
    } catch (err) {
        console.log(err);
    }
    process.exit(); 
}

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}
// console.log(process.argv);