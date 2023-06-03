const mongoose = require("mongoose");

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("mongodb connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error====>", err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect()
}








module.exports = {
  mongoConnect: mongoConnect,
  mongoDisconnect: mongoDisconnect,
};


