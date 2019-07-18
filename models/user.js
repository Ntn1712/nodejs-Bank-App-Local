var mongoose  = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    avatar: String,
    firstName: String,
    lastName: String,
    number: Number,
    age: Number,
    password: String,
    adhar: {type: Number, unique: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);