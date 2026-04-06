const express = require("express");
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../Models/review.js");
const List = require("../Models/List.js");
const {reviewJoi}=require("../schema.js");
 
//joi validate fxn
const validateReview =(req, res, next) => {
    const {error} = reviewJoi.validate(req.body);
    if(error){
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

//review save and show route
router.post("/", validateReview, wrapAsync(async(req, res, next) => {
    const list = await List.findById(req.params.id);
    const review = new Review(req.body.review);
    list.review.push(review);
    await review.save();
    await list.save();

    res.redirect(`/lists/${list._id}`);
}))

//Delete review
router.delete("/", wrapAsync(async(req, res, next) => {
    let {id, reviewId} = req.params;
    await List.findByIdAndUpdate(id, {$pull :{review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/lists/${id}`);
}))

module.exports = router;