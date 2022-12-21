require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const axios = require("axios");
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);
const passport = require("passport");

const passportLocalMongoose = require("passport-local-mongoose");
const _ = require("lodash");







const app = express();

// console.log(process.env.API_KEY);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "ejs");



app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());

app.use(passport.session());





mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const User = require('./models/users.model');
const projectRouter = require('./controller/project.controller');
const requirementRouter = require('./controller/requirement.controller');








app.get("/", function(req, res){
    res.render("register");
});




app.post("/register", function(req, res){
    const un = req.body.username;
    const psw = req.body.password;
    const fn = req.body.fn;
    const tn = req.body.tn;
    const k = req.body.k;

    User.register({username: req.body.username, name: fn, teamName: tn, key: k}, req.body.password, function(err, results){

        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/home");
            });


        }
    });




});




app.post("/login", function(req, res){

    const newProf = new User({
        username: req.body.username,
        password: req.body.password,
        key: req.body.k
    });

    req.login(newProf, function(err){
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
        });
    });



});




app.post("/logout", function(req, res){
    req.logout();
    res.redirect("/");

});

app.post("/about", async (req, res) => {
    res.redirect("/about");
});

app.get("/about", async (req, res) => {

    res.render('about');
});

app.use(projectRouter);
app.use(requirementRouter);



app.listen(process.env.PORT || 3000, function(){
    console.log("Server started successfully");
});


module.exports = app;