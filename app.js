const express = require("express");
const app=express();
const mongoose = require("mongoose");
const List = require("./Models/List.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listJoi = require("./schema.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
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

//joi validate fxn
const validateList =(req, res, next) => {
    const {error} = listJoi.validate(req.body);
    if(error){
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

// show all lists
app.get("/lists", wrapAsync(async (req, res, next) => {
        let lists = await List.find();
        res.render("lists/allList.ejs", {lists});
}))

// update list
app.get("/lists/:id/edit", wrapAsync(async(req, res, next) => {
        let {id} = req.params;
        let list = await List.findById(id);
        if(!list) return next(new ExpressError(404, "List Not found"))
        res.render("lists/edit", {list});
    
}))
app.patch("/lists/:id/edit",validateList, wrapAsync(async(req, res, next) => {
        let {id} = req.params;                    
        await List.findByIdAndUpdate(id, req.body.list, {new : true});
        res.redirect(`/lists/${id}`);
    
}))

// Delete list
app.delete("/lists/delete/:id", wrapAsync(async(req, res, next) => {
        let {id} = req.params;
        await List.findByIdAndDelete(id);
        res.redirect("/lists");
}))

// create new list
app.get("/lists/new", (req, res) => {
    res.render("lists/create");
})
app.post("/lists/create",validateList, wrapAsync(async(req, res, next) => {
    let list = req.body;
        await List.create(req.body.list);
        res.redirect("/lists");
}))

//get specific list details
app.get("/lists/:id", wrapAsync(async (req, res, next) => {
        let {id} = req.params;
        let list = await List.findById(id);
        if (!list) throw new ExpressError(404, "List not found");
        res.render("lists/listDetail.ejs", {list});
}))

// Page not found middleware
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