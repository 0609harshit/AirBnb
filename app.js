const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const lists = require("./routes/lists.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

const sessionOptions = {
    secret : "secretkey",
    resave : false,
    saveUninitialized : true,
}

app.use(session(sessionOptions));
app.use(flash());

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
app.use((req, res, next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.use("/lists", lists);
app.use("/lists/:id/review", reviews);

// Page not found middleware
app.use((req, res, next)=>{
    next(new ExpressError(404, "Page not found"))
})
//global error handler
app.use((err, req, res, next) => {
    let {status=500, message="Something went wrong"}=err;
    res.render("Errors/error.ejs", {status, message});
})
app.listen("8080", () => {
    console.log("App is listening...");
})