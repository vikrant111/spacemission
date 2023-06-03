const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    keplerName:{
        type: String,
        required: true,
    }
});





// Note:
//here we have connected or mapped our schema to the "Planet" collection 
// which mongo automatically converts into lowercase and makes it plural. So, as to represent the number of documents 
// holding objects of properties in that collection


//                          (collection name, schema name)
module.exports = mongoose.model("Planet", planetsSchema)