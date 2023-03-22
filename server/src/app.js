const express = require('express');
const cors = require('cors');
const app = express();
const {planetsRouter} = require("./route/planets/planets.router.js")


//setting all the allowed origins to avoid cors error
var whitelist = ['http://example1.com', 'http://example2.com', 'http://localhost:3000'];
var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }


//the function passes one middleware to allow all the origin
//requesting the server 
//this cors middleware should always be called at the top of your routes
//because the other routes must include it to avoid cors error
  
app.use(cors(corsOptions))
app.use(express.json());
app.use(planetsRouter);


module.exports = app;