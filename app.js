var  express      = require("express"),
     app          = express(),
     bodyParser   = require("body-parser"),
     mongoose     = require("mongoose"),
     flash        = require("connect-flash"),
     passport     = require("passport"),
     LocalStrategy= require("passport-local"),
     methodOverride=require("method-override"),
     User         = require("./models/user"),
     Campground   =  require("./models/campground"),
     Comment      = require("./models/comment"),
     seedDB       = require("./seeds")

var  campgroundRoutes = require("./routes/campgrounds"),
     commentRoutes    = require("./routes/comments"),
     indexRoutes      = require("./routes/index")


// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
mongoose.connect('mongodb+srv://faisal:faisal1234@cluster0-9odkv.mongodb.net/yelp_camp?retryWrites=true&w=majority', {useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+ "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();       //seed database calling

//PASSPORT Config
app.use(require("express-session")({
    secret:"Dream Big",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//adds current user info in every single template
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    //adding flash message for every templte
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(commentRoutes);



// var post = process.env.port || 3000;
// app.listen(post, function(){
//     console.log("yelpcamp is started at "+ post);
// });

//for heroku use below cmds for app.listen n port
app.listen(process.env.PORT, process.env.IP),function(){
    console.log("app started");
};

