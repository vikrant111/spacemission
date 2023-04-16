const path = require("path");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const {planetsRouter} = require("./route/planets/planets.router.js")
const {launchesRouter} = require("./route/launches/launches.router.js")
// const bodyParser = require("body-parser");


//the function passes one middleware to allow all the origin
//requesting the server 
//this cors middleware should always be called at the top of your routes
//because the other routes must include it to avoid cors error
  


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(morgan('combined'))
// parse application/json
// app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// parse text/plain
// app.use(bodyParser.text());

// parse raw
// app.use(bodyParser.raw());

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// app.use((req, res, next) => {
//   req.parsedBody = JSON.parse(req.body);
//   next();
// });


app.use(express.static(path.join(__dirname, "..", "public")));

app.use('/planets',planetsRouter);
app.use('/launches',launchesRouter);

app.get('/*',(req, res)=>{
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})



module.exports = app;