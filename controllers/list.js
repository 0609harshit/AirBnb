const List = require("../Models/List");
const ExpressError = require("../utils/ExpressError")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.showLists = async (req, res, next) => {
        let lists = await List.find();
        res.render("lists/allList.ejs", {lists});
};

module.exports.getUpdateList = async(req, res, next) => {
        let {id} = req.params;
        let list = await List.findById(id);
        if(!list) return next(new ExpressError(404, "List Not found"))  
        res.render("lists/edit", {list});
    
};
module.exports.patchUpdateList = async(req, res, next) => {
        let {id} = req.params;                    
        let list = await List.findByIdAndUpdate(id, req.body.list, {new : true});
        if(req.file){
                let imageUrl = req.file.path;
                let imageFilename = req.file.filename;
                list.image = {url : imageUrl, filename : imageFilename};
                await list.save();
        }
        req.flash("success", "List updated successfully!");
        res.redirect(`/lists/${id}`);
    
};
module.exports.deleteList = async(req, res, next) => {
        let {id} = req.params;
        await List.findByIdAndDelete(id);
        req.flash("success", "List deleted successfully!");
        res.redirect("/lists");
};
module.exports.newList = async(req, res, next) => {
    let list = req.body;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.list.location,
        limit: 1
        })
        .send();       
    let imageUrl = req.file.path;
    let imageFilename = req.file.filename;
        let newList = new List(req.body.list);
        newList.owner = req.user._id;
        newList.image = {filename :imageFilename, url : imageUrl};
        newList.geometry = response.body.features[0].geometry;
        await newList.save();
        req.flash("success", "List created successfully!");
        res.redirect("/lists");
};
module.exports.listDetails = async (req, res, next) => {
        let {id} = req.params;
        let list = await List.findById(id).populate("review").populate("owner");
        if (!list) throw new ExpressError(404, "List not found");
        res.render("lists/listDetail.ejs", {list});
};
