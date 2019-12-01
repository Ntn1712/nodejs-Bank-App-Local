var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index");

router.get("/about", (req, res)=>{
    res.render("about");
})

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/member/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("cards").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("users/index", {foundUser: foundUser});
        }
    });
});

router.get("/member/:id/adhar/update", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("users/adharUpdate", {foundUser: foundUser});
        }
    })
});

router.put("/member/:id/adhar", middleware.isLoggedIn, function(req, res){
    User.findByIdAndUpdate(req.params.id, {$set: {adhar: req.body.adhar}}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.redirect("/member/" + foundUser._id);
        }
    })
});

router.get("/member/:id/balance", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("cards").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("users/estimated", {foundUser: foundUser});
        }
    })
});

module.exports = router;