var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

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
//handle register form
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
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

//middleware func isloggedin defined here
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;