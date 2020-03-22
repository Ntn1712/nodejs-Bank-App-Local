require("dotenv").config();

var express = require("express");
var app = express();
var createError = require("http-errors");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");

var User = require("./models/user");
var Card = require("./models/card");
var middleware = require("./middleware/index");

var userRoutes = require("./routes/user");
var cardRoutes = require("./routes/card");
var indexRoutes = require("./routes/index");

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/bank_app", 
    {useNewUrlParser: true, useFindAndModify: true},
    err => {
        if(!err) console.log("Connection successfull");
    });
    
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(logger("dev"));
app.use(cookieParser());

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


//404 error and forward to the error handler
app.use(function(req, res,  next) {
    next(createError(404));
});
  

//error handling
app.use(function(err, req, res, next) {
    console.log(err);
  
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({ success: false, msg: err });
  });

    
module.exports = app;