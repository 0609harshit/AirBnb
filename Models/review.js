const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },
    comment : {
        type : String,
    },
    time : {
        type : Date,
        default : Date.now,
    },
})

module.exports = mongoose.model("Review", reviewSchema);