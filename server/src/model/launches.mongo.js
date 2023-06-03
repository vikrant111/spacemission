const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String, 
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    target: {
        // ref: 'Planet',
        type: String,
        // required: true,
    },
    customer: [String],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
})


//here we have connected or mapped our schema to the "Launch" collection 
// which mongo automatically converts into lowercase and makes it plural. So, as to represent the number of documents 
// holding objects of properties in that collection


//                          (collection name, schema name)
module.exports = mongoose.model("Launch", launchesSchema)