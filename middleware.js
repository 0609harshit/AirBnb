const List = require("./Models/List");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be looged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirecturl=(req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id}=req.params;
    let list = await List.findById(id);
    if(!req.user || !list.owner.equals(req.user._id)){
        req.flash("error", "User access denied");
        return res.redirect(`/lists/${id}`);
    }
    next();
}