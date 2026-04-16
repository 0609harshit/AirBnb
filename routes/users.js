const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware");

router.route("/register")
    .get((req, res, next) => {
        res.render("users/register");
    })
    .post(async(req, res, next) =>{
    let {username, email, password} = req.body;
    let newUser = new User({ email, username});
    await User.register(newUser, password);
    req.login(newUser, (err) => {
        if(err) {return next(err);}  
        res.redirect("/lists");
    })
    })


router.route("/login")
    .get(saveRedirecturl, (req, res) => {
        res.render("users/login.ejs");
    })
    .post(passport.authenticate("local", {failureRedirect : "/login", failureFlash : true,}), async(req, res, next) => {
        let redirectUrl=res.locals.redirectUrl||"/lists";
        res.redirect(redirectUrl);
    })


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        res.redirect("/lists");
    })
})

module.exports=router;