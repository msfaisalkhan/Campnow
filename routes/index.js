var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/",(req, res)=>{
    res.render("landing");
});

//================================
//AUTH route
//================================

//signup form
router.get("/register", function(req,res){
    res.render("register");
});
//handle register(signup) form
router.post("/register", function(req,res){
    var newUser = new User(
        {
            username: req.body.username, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            avatar: req.body.avatar,
            email: req.body.email
        });
    // eval(require('locus'));
    if(req.body.adminCode === 'abc123') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success","Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
    }), function(req,res){
    
});

//logout route
router.get("/logout", (req,res)=>{
    req.logOut();
    req.flash("success", "Logged out successfully!");
    res.redirect("/campgrounds");
});

//Users profile
router.get("/users/:id", (req,res)=> {
    User.findById(req.params.id, function(err, foundUser) {
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("/campgrounds");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        })
        
    });
});

//edit user routes
router.get("/users/:id/edit", middleware.checkUserOwnership, function(req,res){
    User.findById(req.params.id, function(err, foundUser){ 
    res.render("users/edit", {user: foundUser});
    });
});

//update user route
router.put("/users/:id", middleware.checkUserOwnership, function(req,res){
    //find the update the correct 
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/users/" + req.params.id);
        }
    });
});

//Destroy user route
router.delete("/users/:id", middleware.checkUserOwnership, function(req,res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })    
});

//middleware func isloggedin defined here
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;