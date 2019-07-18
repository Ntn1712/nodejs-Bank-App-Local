var mongoose = require("mongoose");
var Card = require("../models/card");
var User = require("../models/user");



var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;