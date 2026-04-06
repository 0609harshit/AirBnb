const express = require("express");
const router = express.Router();
const List = require("../Models/List.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listJoi} = require("../schema.js");
 
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
router.get("/", wrapAsync(async (req, res, next) => {
        let lists = await List.find();
        res.render("lists/allList.ejs", {lists});
}))

// update list
router.get("/:id/edit", wrapAsync(async(req, res, next) => {
        let {id} = req.params;
        let list = await List.findById(id);
        if(!list) return next(new ExpressError(404, "List Not found"))  
        res.render("lists/edit", {list});
    
}))
router.patch("/:id/edit",validateList, wrapAsync(async(req, res, next) => {
        let {id} = req.params;                    
        await List.findByIdAndUpdate(id, req.body.list, {new : true});
        req.flash("success", "List updated successfully!");
        res.redirect(`/lists/${id}`);
    
}))

// Delete list
router.delete("/delete/:id", wrapAsync(async(req, res, next) => {
        let {id} = req.params;
        await List.findByIdAndDelete(id);
        req.flash("success", "List deleted successfully!");
        res.redirect("/lists");
}))

// create new list
router.get("/new", (req, res) => {
    res.render("lists/create");
})
router.post("/create",validateList, wrapAsync(async(req, res, next) => {
    let list = req.body;
        await List.create(req.body.list);
        req.flash("success", "List created successfully!");
        res.redirect("/lists");
}))

//get specific list details
router.get("/:id", wrapAsync(async (req, res, next) => {
        let {id} = req.params;
        let list = await List.findById(id).populate("review");
        if (!list) throw new ExpressError(404, "List not found");
        res.render("lists/listDetail.ejs", {list});
}))

module.exports = router;