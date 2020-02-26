var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//campgrounds routes
router.get("/",function(req,res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //Get all campgrounds from db
        Campground.find({name: regex}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                if(allCampgrounds.length < 1) {
                    noMatch = "No campgrounds match that query, please try again.";
                }
                res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user, noMatch: noMatch});
             }
          });
    } else {
    //Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user,  noMatch: noMatch});
        }
    });
    }
});

router.post("/", middleware.isLoggedIn, (req,res)=>{
    //get data from form and add to compgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price: price,image: image, description:desc, author:author}
    //below one line command is used before the db in which we add a item in campground array which is now not required
    // campgrounds.push(newCampground);
    //create a new campground and save it in db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
            console.log(newlyCreated);
        }
    });
});

// new route
router.get("/new",middleware.isLoggedIn, (req,res)=>{
    res.render("campgrounds/new");
});

//SHOW- shows the info about particular campground
router.get("/:id",function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("/campgrounds");
        } else{
            //redirect show
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

//edit campground routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){ 
    res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find the update the correct 
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect to show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campg route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    })    
});

//func isloggedin defined here (middleware)
//middleware authenrication
//middleware is now in middleware fld 

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;