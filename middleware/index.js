var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
//all the middleware goes here like isloggedin n checkownerships
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground not found");
                res.redirect("/campgrounds");
            } else {
                //does user own the camp?
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
                } else {
                    req.flash("error","You don't permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                //does user own the commmnt?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
                } else {
                    req.flash("error","You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkUserOwnership = function(req,res,next) {
    //is user logged in?
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                req.flash("error","User not found");
                res.redirect("/campgrounds");
            } else {
                //does user own the camp?
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                   next();
                } else {
                    req.flash("error","You don't permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In!");
    res.redirect("/login");
}

module.exports = middlewareObj;