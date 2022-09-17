const mongoose = require("mongoose");

const config = require("../config");

mongoose.connect(config.MONGODB_URL, { useNewUrlParser: true },
(err)=>{
    if(err) throw err;
    console.log("connected to mongodb");
}
);