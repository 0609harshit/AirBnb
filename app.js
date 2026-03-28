const express = require("express");
const app=express();
const mongoose = require("mongoose");
const List = require("./Models/List.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");


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



// show all lists
app.get("/lists", async (req, res, next) => {
    try{
        let lists = await List.find();
        if(!lists) return next(new ExpressError(404, "List Not found"))
        res.render("lists/allList.ejs", {lists});
    }
    catch(err){
        next(err);
    }
})

// update list
app.get("/lists/:id/edit", async(req, res, next) => {
    try{
        let {id} = req.params;
        let list = await List.findById(id);
        if(!list) return next(new ExpressError(404, "List Not found"))
        res.render("lists/edit", {list});
    }
    catch(err){
        next(err);
    }
})
app.patch("/lists/:id/edit", async(req, res, next) => {
    try{
        let {id} = req.params;
        await List.findByIdAndUpdate(id, req.body.list, {new : true});
        res.redirect(`/lists/${id}`);
    }
    catch(err){
        next(err);
    }
})

// Delete list
app.delete("/lists/delete/:id", async(req, res, next) => {
    try{
        let {id} = req.params;
        await List.findByIdAndDelete(id);
        res.redirect("/lists");
    }
    catch(err){
        next(err);
    }
})

// create new list
app.get("/lists/new", (req, res) => {
    res.render("lists/create");
})
app.post("/lists/create", async(req, res, next) => {
    try{
        await List.create(req.body.list);
        res.redirect("/lists");
    }
    catch(err){
        next(err);
    }
})

//get specific list details
app.get("/lists/:id", async (req, res, next) => {
    try{
        let {id} = req.params;
        let list = await List.findById(id);
        res.render("lists/listDetail.ejs", {list});
    }
    catch(err){
        next(err);
    }
})

// Page found middleware
app.use((req, res, next)=>{
    next(new ExpressError(404, "Page not found"))
})
//global error handler
app.use((err, req, res, next) => {
    let {status=500, message="Something went wrong"}=err;
    res.status(status).send(message);
})
app.listen("8080", () => {
    console.log("App is listening...");
})