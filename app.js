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
// const passportw = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const passportLocalMongoosew = require("passport-local-mongoose");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const _ = require("lodash");
// const router = express.Router();
const fs = require('fs');
// var path = require('path');






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

// app.use(sessionw({
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

app.use(passport.initialize());

app.use(passport.session());





mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

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

const projSchema = new mongoose.Schema({
    key: String,
    desc: String,
    owner: String,
    members: String,
    risks: [{riskdes: String, status: String, pida: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'}}]
});


const Project = mongoose.model('Project', projSchema);

const reqSchema = new mongoose.Schema({
    pid: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'},
    funcreq: String,
    design: String,
    reqanlsys: String,
    coding: String,
    testing: String,
    pm: String
});

const Requirement = mongoose.model('Requirement', reqSchema);





// ****************************** RISKS ***********************

app.post("/risks", function(req, res){
    Project.findOneAndUpdate({_id: req.body.addSt}, {$push: {risks: [{riskdes: req.body.risk, status: req.body.stats, pida: req.body.addSt}]}}, function(err, result){

        if(err){
            console.log(err);
        } else {
            res.redirect("/lists");
        }

    });
});

app.post("/riskdel", async (req, res) => {
    
    const delreq = await Project.updateMany({}, {$pull: {risks: {_id: req.body.rmv9}}}).exec();

    res.redirect(`/dashboard?rsk=${req.body.rmmv}`);
    
});

app.post("/high", async (req, res) => {
   
    const updtsa = await Project.findOneAndUpdate(
        {
          "risks._id": req.body.hg2},
          {$set:{'risks.$.status': req.body.hg1}
        }
    ).exec();
    res.redirect(`/dashboard?rsk=${req.body.hg3}`);
});

app.post("/low", async (req, res) => {
   
    const updtss = await Project.findOneAndUpdate(
        {
          "risks._id": req.body.lw2},
          {$set:{'risks.$.status': req.body.lw1}
        }
    ).exec();
    res.redirect(`/dashboard?rsk=${req.body.lw3}`);
});

app.post("/medium", async (req, res) => {
   
    const updtssz = await Project.findOneAndUpdate(
        {
          "risks._id": req.body.med2},
          {$set:{'risks.$.status': req.body.med1}
        }
    ).exec();
    res.redirect(`/dashboard?rsk=${req.body.med3}`);
});



// ****************************** Requirements ***********************

app.post("/monitor", async (req, res) => {
    const upmn = await Requirement.findOneAndUpdate({_id: req.body.addMts}, {$set: {design: req.body.ds1, reqanlsys: req.body.rq1, coding: req.body.cod1, testing: req.body.t1, pm: req.body.pm1}}).exec();
    res.redirect(`/dashboard?rsk=${req.body.pid5}`);
    
});



app.post("/reqs", async (req, res) => {

    const newReqz = new Requirement({
        pid: req.body.addrq,
        funcreq: req.body.reqf
    });
    newReqz.save();
    res.redirect(`/dashboard?rsk=${req.body.addrq}`);
});



app.post("/reqdel", async (req, res) => {
    const rqdels = await Requirement.findByIdAndRemove(req.body.rdl).exec();
    res.redirect(`/dashboard?rsk=${req.body.pidz}`);
});




// ****************************** Dashboard ***********************

app.get("/dashboard", async (req, res) => {
    const getProjs = await Project.findById(req.query.rsk).exec();
    const getReks = await Requirement.find({pid: req.query.rsk}).exec();
    // console.log(getReks);
    res.render('dashboard', {risksInfo: getProjs.risks, reqInfo: getReks, pIde: req.query.rsk, ppId: req.query.rsk});

});









app.post("/newp", function(req, res){


    const newProject = new Project({
        key: req.user.key,
        desc: req.body.des,
        owner: req.body.owner,
        members: req.body.memb
    });

    newProject.save();
    res.redirect("/home");

});

app.get("/lists", function(req, res){
Project.find({key: req.user.key}, function(err, results){
    if(err){
        res.status(500).send('Ops', err);
    } else {
        res.render('lists', {datas: results});
        
    }
});
});

app.get("/register", function(req, res){
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

app.get("/login", function(req, res){
    res.render('login');
});

app.get("/home", function(req, res){

    if(req.isAuthenticated()){
        User.find({key: req.user.key}, function(err, results){
            if (err) {
                res.status(500).send('Ops', err);
            } else {
                res.render('home', {teamn: results[0].teamName, ky: results[0].key});
            }
        });
    }
});

app.post("/logout", function(req, res){
    req.logout();
    res.redirect("/login");

});





app.listen(process.env.PORT || 3000, function(){
    console.log("Server started successfully");
});




// const projSchema = new mongoose.Schema({
//     key: String,
//     desc: String,
//     owner: String,
//     members: String,
//     risks: [{riskdes: String, status: String, pida: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'}}],
//     reqs: [{reqf: String, reqn: String, pida: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'}}],
//     monitor: [{analysis: String, designing: String, testing: String, mng: String, pida: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'}}]
// });




// let apiDatas;


// function getDemos(keyid){
//         axios.get('http://localhost:3000/proj/' + keyid, function(results){
//             return results;
//         });
        

    
// };

// module.exports = {getDemos};

// export default async function() {
//     if (!apiDatas) {
//         await getDemos("123");
//     }
//     let f = apiDatas;
//     return f;
// };


// getDemos("123").then(function(results) {
//     console.log(JSON.stringify(results.data[0].owner));
// });








// app.post("/reqs", function(req, res){
//     Project.findOneAndUpdate({_id: req.body.addrq}, {$push: {reqs: [{reqf: req.body.reqf, reqn: req.body.reqn, pida: req.body.addrq}]}}, function(err, result){

//         if(err){
//             console.log(err);
//         } else {
//             const mntr = new Monitor({
//                 reqId: result.reqs._id
//             });
//             mntr.save();
//             res.redirect("/lists");
//         }

//     });
// });







// app.get("/proj/sts/:stid", async (req, res) => {
//     const dminfz = await Project.find({key: req.user.key}).exec();
//     const dmrz = [];
//     dminfz[0].risks.forEach(function(item){

//         if(item.id == req.params.stid){
//             dmrz.push(item);
//         }
//     });

//     res.send(dmrz);
    
// });

// app.get("/proj/frq/:rstid", async (req, res) => {
//     const dminfzs = await Project.find({key: req.user.key}).exec();
//     const dmrzs = [];
//     dminfzs[0].reqs.forEach(function(item){

//         if(item.id == req.params.rstid){
//             dmrzs.push(item);
//         }
//     });

//     res.send(dmrzs);
    
// });