
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app=express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const lists = require("./routes/lists.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./Models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));


const store = MongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});
store.on("error", (err) => {
    console.log(err);
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

async function estbConn(){
    try{
        await mongoose.connect(process.env.MONGO_URL)
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
    res.locals.currUser=req.user;
    next();
})



app.use("/lists", lists);
app.use("/lists/:id/review", reviews);
app.use("/", users);

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
