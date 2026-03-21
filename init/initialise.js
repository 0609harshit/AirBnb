    const mongoose = require("mongoose");
    const data = require("./initialData");
    const List = require("../Models/List");

    async function estbConn(){
        try{
            await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
        }
        catch(err){
            console.log(err);
        }
    }

    estbConn().then(()=>{
        const fxn = async ()=>{
            await List.deleteMany();
            await List.insertMany(data);
        }
        fxn();
    })
    .catch((err)=>{
        console.log("Error found!", err);
    })