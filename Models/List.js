const mongoose = require("mongoose");
const Schema=mongoose.Schema;

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
    }
})

const List=mongoose.model("List", ListSchema);
module.exports=List;