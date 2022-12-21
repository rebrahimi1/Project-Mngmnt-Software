const mongoose = require("mongoose");

const passport = require("passport");

const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    teamName: String,
    key: String

});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;