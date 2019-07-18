var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Card = require("../models/card");
var middleware = require("../middleware/index");

router.get("/member/:id/cards/new", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("cards/new", {foundUser: foundUser});
        }
    })
});

router.post("/member/:id/cards", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.create(req.body.card, function(err, newCard){
                if(err){
                    console.log(err);
                } else {
                    newCard.save();
                    foundUser.cards.push(newCard);
                    foundUser.save();
                    res.redirect("/member/" + req.params.id + "/cards");
                }
            })
        }
    })
});

// show all cards

router.get("/member/:id/cards", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("cards").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            res.render("cards/index", {foundUser: foundUser});
        }
    })    
});

//details of one card

router.get("/member/:id/cards/:card_id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    res.render("cards/show", {foundUser: foundUser, foundCard: foundCard});
                }
            })
        }
    });
});

//withdraw from card

router.get("/member/:id/cards/:card_id/withdraw", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    res.render("cards/withdraw", {foundCard: foundCard, foundUser: foundUser});
                }
            })
        }
    })
});

router.post("/member/:id/cards/:card_id/withdraw", middleware.isLoggedIn, function(req, res){
    var amount = req.body.money;
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    var newAmount = parseInt(foundCard.money) - parseInt(amount);
                    foundCard.money = newAmount;
                    if(newAmount < 0){
                        res.redirect("back")
                    } else {
                        foundCard.save();
                        foundUser.save();
                        res.redirect("/member/" + foundUser._id + "/cards/" + foundCard._id);
                    }
                }
            })
        }
    })
});

//deposit in card

router.get("/member/:id/cards/:card_id/deposit", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    res.render("cards/deposit", {foundCard: foundCard, foundUser: foundUser});
                }
            })
        }
    })
});

router.post("/member/:id/cards/:card_id/deposit", middleware.isLoggedIn, function(req, res){
    var amount = req.body.money;
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.loge(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    var newAmount = parseInt(foundCard.money) + parseInt(amount);
                    foundCard.money = newAmount;
                    foundCard.save();
                    foundUser.save();
                    res.redirect("/member/" + foundUser._id + "/cards/" + foundCard._id);
                }
            })
        }
    })
});

//transact from one card to another

router.get("/member/:id/cards/:card_id/transact", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("cards").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    res.render("cards/transact", {foundCard: foundCard, foundUser: foundUser, User: User});
                }
            })
        }
    })
});

router.post("/member/:id/cards/:card_id/transact", middleware.isLoggedIn, function(req, res){
    var newAmount, decreasedAmount;
    var amount = req.body.money;
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    Card.find({cardNumber: req.body.cardNumber}, function(err, cards){
                        if(err){
                            console.log(err);
                        } else {
                            newAmount = parseInt(cards[0].money) + parseInt(amount);
                            cards[0].money = newAmount;
                            decreasedAmount = parseInt(foundCard.money) - parseInt(amount);
                            foundCard.money = decreasedAmount;
                            foundCard.save();
                            cards[0].save();
                            res.redirect("/member/" + foundUser._id + "/cards");
                        }
                    })
                }
            })
        }
    });
});

router.get("/member/:id/cards/:card_id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            Card.findById(req.params.card_id, function(err, foundCard){
                if(err){
                    console.log(err);
                } else {
                    res.render("cards/edit", {foundUser: foundUser, foundCard: foundCard});
                }
            })
        }
    })
});

router.put("/member/:id/cards/:card_id", function(req, res){
    Card.findByIdAndUpdate(req.params.card_id, req.body.card, function(err, updatedCard){
        if(err){
            console.log(err);
        } else {
            res.redirect("/member/" + req.params.id + "/cards/" + updatedCard._id);
        }
    })
});

router.delete("/member/:id/cards/:card_id", function(req, res){
    Card.findByIdAndRemove(req.params.card_id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/member/" + req.params.id + "/cards");
        }
    })
});

module.exports = router;
