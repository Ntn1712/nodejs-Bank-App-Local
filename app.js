require("dotenv").config();

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");

var User = require("./models/user");
var Card = require("./models/card");
var middleware = require("./middleware/index");

var userRoutes = require("./routes/user");
var cardRoutes = require("./routes/card");
var indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/bank_app");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));



// ==================================
// Passport Configuration
// ==================================

app.use(require("express-session")({
    secret: "nitin is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.use(indexRoutes);
app.use(userRoutes);
app.use(cardRoutes);

app.listen(8000, function(){
    console.log("bank app has started");
});
    