var mongoose = require("mongoose");

var cardSchema = new mongoose.Schema({
    name: String,
    cardNumber: {type: Number, unique: true, required: true},
    expiryDate: Date,
    cvv: Number,
    money: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model("Card", cardSchema);