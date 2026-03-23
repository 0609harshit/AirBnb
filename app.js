const express = require("express");
const app=express();
const mongoose = require("mongoose");
const List = require("./Models/List.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


async function estbConn(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
    }
    catch(err){
        console.log(err);
    }
}

estbConn().then(()=>{console.log("Connection established");})
.catch((err)=>{
    console.log("Error found!", err);
})



app.get("/lists", async (req, res) => {
    let lists = await List.find();
    res.render("lists/allList.ejs", {lists});
})

app.get("/lists/:id/edit", async(req, res) => {
    let {id} = req.params;
    let list = await List.findById(id);
    res.render("lists/edit", {list});
})
app.patch("/lists/:id/edit", async(req, res) => {
    let {id} = req.params;
    await List.findByIdAndUpdate(id, req.body.list, {new : true});
    res.redirect(`/lists/${id}`);
})
app.delete("/lists/delete/:id", async(req, res) => {
    let {id} = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/lists");
})
app.get("/lists/:id", async (req, res) => {
    let {id} = req.params;
    let list = await List.findById(id);
    res.render("lists/listDetail.ejs", {list});
})
app.listen("8080", () => {
    console.log("App is listening...");
})