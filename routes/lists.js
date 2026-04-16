const express = require("express");
const router = express.Router();
const List = require("../Models/List.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listJoi} = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const {showLists, getUpdateList, patchUpdateList, deleteList, newList, listDetails} = require("../controllers/list.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


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
router.get("/", wrapAsync(showLists));

// update list
router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(getUpdateList))
    .patch(isOwner, validateList, upload.single("list[image]"), wrapAsync(patchUpdateList));

// Delete list
router.delete("/delete/:id", isOwner, wrapAsync(deleteList));

// create new list
router.get("/new", isLoggedIn, (req, res) => {
    res.render("lists/create");
})
router.post("/create",isLoggedIn, validateList, upload.single("list[image]"), wrapAsync(newList));

//get specific list details
router.get("/:id", wrapAsync(listDetails));

module.exports = router;