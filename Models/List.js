const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const Review = require("./review.js");

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
        type : String,
        default : "https://img.freepik.com/free-vector/gradient-multigenerational-home-illustration_52683-134520.jpg?semt=ais_hybrid&w=740&q=80",        set : (v) => v===""?"https://img.freepik.com/free-vector/gradient-multigenerational-home-illustration_52683-134520.jpg?semt=ais_hybrid&w=740&q=80":v,
        required : true
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
    ]
})

//Deleting all reviews related to list on deleting a list
ListSchema.post("findOneAndDelete", async(list) => {
    if(list){
        Review.deleteMany({_id : {$in : list.review}});
    }
})

const List=mongoose.model("List", ListSchema);
module.exports=List;