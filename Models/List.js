const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");
const User = require("./user");

const ListSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        filename : String,
        url : String,
    },
    price : {
        type : Number,
        default : 1,
        min : 1,
    },
    location : {
        type : String
    },
    country : {
        type : String,
        required : true
    },
    review : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
})

//Deleting all reviews related to list on deleting a list
ListSchema.post("findOneAndDelete", async(list) => {
    if(list){
        Review.deleteMany({_id : {$in : list.review}});
    }
})

const List=mongoose.model("List", ListSchema);
module.exports=List;