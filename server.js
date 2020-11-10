const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult, matchedData, normalizeEmail } = require('express-validator');
const mongoose = require('mongoose');
const PatientInfo = require('./model/Information');
const fastCSV = require('fast-csv');
const multer = require('multer');
// const fs = require('fs');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');

const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//view engine
app.set('view engine', 'twig');

//Display form
app.get('/', (req,res) => {
    res.render('form');
});
//Display Upload form
app.get('/upload', (req,res) => {
  res.render('upload');
});

//DB Connection  .  insert your database connection link instead of 'link' mentioned below 
const conn = mongoose.createConnection('link', { 
  useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true})

  conn.on('error', console.log.bind(console, "connection error")); 
  conn.once('open',() => { 
    console.log("DB Connected");
    gfs = Grid(conn.db, mongoose.mongo); 
    gfs.collection('uploads');
}) 

//Init Storage
const storage = new GridFsStorage({
  url: 'link',  // insert your database link here
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
        return reject(err);}
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {  
          filename: filename,
          bucketName: 'uploads'};
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage }); //Upload finishes here

//Post Upload form
app.post('/uploadfile', upload.single('file') ,(req,res) => {
  res.render('fileUploadSuccess');
});
//Form Post request with validation
app.post('/',[
    check('ddlDoctor')
    .notEmpty().withMessage('Please choose the doctor'),
    check('inputName')
    .notEmpty().withMessage('Please enter your name'),
    check('inputPhone')
    .notEmpty().isNumeric().withMessage('Please Enter a valid phone number'),
    check('InputEmail', 'Error Occured')
    .isEmail().notEmpty().withMessage('Please enter your valid email ID'),
    check('inputDOB')
    .notEmpty().isDate({format: 'YYYY-MM-DD'}).withMessage('Please enter your date of birth in yyyy-mm-dd format')] , async (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()){
            const details = matchedData(req);  //Test
            const newPatient= new PatientInfo();  //Test
            // console.log(newPatient);  //Test
            // console.log(details); //Test
            await conn.collection('information').insertOne(req.body);
            console.log("Sucess. data stored to DB");            
            const doctor = require('./tables/doctor');
            const doctor_patient = require('./tables/doctor_patient');
            const patient = require('./tables/patient');
            return res.render('successMessage');           
        }else{            
            const details = matchedData(req);
            return res.render('form',{title: "Add more details", errors: errors.mapped(), details})
        } 
    }
)   //Post finishes here

//Port
app.listen(2000, console.log("Server running on port 2000"));