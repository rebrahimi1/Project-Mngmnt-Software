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
    name: String,
    desc: String,
    owner: String,
    risks: [{riskdes: String, status: String, pida: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'}}]
});


const Project = mongoose.model('Project', projSchema);

const reqSchema = new mongoose.Schema({
    pid: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'},
    funcreq: String,
    design: Number,
    reqanlsys: Number,
    coding: Number,
    testing: Number,
    pm: Number,
    progress: String,
    assigne: String,
    details: String
});

const Requirement = mongoose.model('Requirement', reqSchema);




const memberSchema = new mongoose.Schema({
    pid: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'},
    member: String,
    email: String,
    title: String
});

const Member = mongoose.model('Member', memberSchema);




// ******************** HOME ****************


app.get("/home", async(req, res) => {

  
    const getUser = await User.findById(req.user.id).exec();
    const getProjects = await Project.find({key: req.user.key}).exec();
    res.render('home', {userInfo: getUser, projInfo: getProjects, key: req.user.key});


});


app.post("/home", async(req, res) => {

res.redirect("/home");

});




// ****************** CREATE NEW PROJECT **************

app.post("/newp", function(req, res){


    const newProject = new Project({
        key: req.user.key,
        name: req.body.pname,
        desc: req.body.prjdesc,
        owner: req.body.owner
    });

    newProject.save();
    res.redirect("/home");

});






// ****************************** Project ***********************

app.get("/project", async (req, res) => {
    const getProjs = await Project.findById(req.query.pid).exec();
    // const getReks = await Requirement.find({pid: req.query.pid}).exec();
    const getMbr = await Member.find({pid: req.query.pid}).exec();
    const uInfo = await User.findById(req.user.id).exec();
    res.render('project', {projInfo: getProjs, pIde: req.query.pid, mbrInfo: getMbr, usInfo: uInfo});

});




// ************ ADD NEW MEMBER ************

app.post("/newmbr", async (req, res) => {
    const nwmbr = new Member({
        pid: req.body.pid,
        member: req.body.mbnm,
        email: req.body.mbemail,
        title: req.body.mbttl
    });
    nwmbr.save();
    res.redirect(`/project?pid=${req.body.pid}`);
});


// ************ REMOVE MEMBER ************

app.post("/rmvmbr", async (req, res) => {
    await Member.findOneAndDelete({pid: req.body.pid}).exec();
    res.redirect(`/project?pid=${req.body.pid}`);
});


















// *********************** PROJECT Risk *********************

app.get("/status", async (req, res) => {

    const getProjssz = await Project.findById(req.query.pid).exec();
    const uInfosz = await User.findById(req.user.id).exec();
    res.render('status', {projInfo: getProjssz, pIde: req.query.pid, usInfo: uInfosz});

});


// *********************** Add Risk *********************

app.post("/addrisks", function(req, res){
    Project.findOneAndUpdate({_id: req.body.pid}, {$push: {risks: [{riskdes: req.body.rskdesc, status: req.body.sts, pida: req.body.pid}]}}, function(err, result){

        if(err){
            console.log(err);
        } else {
           res.redirect(`/status?pid=${req.body.pid}`);
        }

    });
});



// *************************** Change Risk Status **************************

app.post("/changeStatus", async (req, res) => {
   
    await Project.findOneAndUpdate(
        {
          "risks._id": req.body.stid},
          {$set:{'risks.$.status': req.body.statuses}
        }
    ).exec();
    res.redirect(`/status?pid=${req.body.pid}`);
});


// *************************** Remove Risk **************************

app.post("/riskdel", async (req, res) => {
    
    await Project.updateMany({}, {$pull: {risks: {_id: req.body.rmv9}}}).exec();

    res.redirect(`/status?pid=${req.body.pid}`);
    
});












// **************************************************** REQUIREMENTS STARTS ************************************************************



// ************ Go TO REQUIREMENTS ************

app.get("/requirement", async (req, res) => {
    const getProjss = await Project.findById(req.query.pid).exec();
    const getRekss = await Requirement.find({pid: req.query.pid}).exec();
    const getMbrs = await Member.find({pid: req.query.pid}).exec();
    const uInfos = await User.findById(req.user.id).exec();
    res.render('requirement', {projInfo: getProjss, reqInfo: getRekss, pIde: req.query.pid, mbrInfo: getMbrs, mbrInfoz: getMbrs, usInfo: uInfos});

});



// ************ ADD NEW REQUIREMENT ************

app.post("/addreq", async (req, res) => {
    const addNewRq = new Requirement({
        pid: req.body.pid,
        funcreq: req.body.reqttl,
        assigne: req.body.asgne,
        details: req.body.reqdsc
    });

    addNewRq.save();
    res.redirect(`/requirement?pid=${req.body.pid}`);
});


// ************* CHANGE MEMBER ****************

app.post("/mbrchange", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.cgmbr}, {$set: {assigne: req.body.asgnch}}).exec();
    res.redirect(`/requirement?pid=${req.body.pid}`);
});


// ************* CHANGE PROGRESS ****************
app.post("/rqstchange", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.cgst}, {$set: {progress: req.body.reqst}}).exec();
    res.redirect(`/requirement?pid=${req.body.pid}`);
});


// ************ REMOVE REQUIREMENT ************

app.post("/reqremove", async (req, res) => {
    await Requirement.findByIdAndDelete(req.body.reqrv).exec();
    res.redirect(`/requirement?pid=${req.body.pid}`);
});










// **************************************************** MONITORING STARTS ************************************************************





// ************* GET MONITORING *************

app.get("/monitor", async (req, res) => {

    const getProjsss = await Project.findById(req.query.pid).exec();
    const getReksss = await Requirement.find({pid: req.query.pid}).exec();
    const getMbrss = await Member.find({pid: req.query.pid}).exec();
    const uInfoss = await User.findById(req.user.id).exec();
    res.render('monitor', {projInfo: getProjsss, reqInfo: getReksss, reqInfos: getReksss, pIde: req.query.pid, mbrInfo: getMbrss, mbrInfoz: getMbrss, usInfo: uInfoss});

});


// ************ ADD MONITORING ************

app.post("/addMont", async (req, res) => {
    await Requirement.findOneAndUpdate({funcreq: req.body.reqid}, {$set: {design: req.body.dsghr, reqanlsys: req.body.anlhr, coding: req.body.cdhr, testing: req.body.tsthr, pm: req.body.mghr}}).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});


// ******** Change Req HR *************

app.post("/changeReqhr", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.reqhr}, {$set: {reqanlsys: req.body.anlhrs}}).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});


// ******** Change Design HR *************

app.post("/changeDesg", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.dghr}, {$set: {design: req.body.dsghrs}}).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});

// ******** Change Coding HR *************

app.post("/changeCode", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.cdhr}, {$set: {coding: req.body.cdhrs}}).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});

// ******** Change Coding HR *************

app.post("/changetest", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.tshr}, {$set: {testing: req.body.tshrs}}).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});


// ******** Change Coding Project Management *************

app.post("/changepm", async (req, res) => {
    await Requirement.findOneAndUpdate({_id: req.body.pmhr}, {$set: {pm: req.body.pmhrs}}).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});


app.post("/delmonitor", async (req, res) => {
    await Requirement.findByIdAndDelete(req.body.rmvmt).exec();
    res.redirect(`/monitor?pid=${req.body.pid}`);
});











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





app.listen(process.env.PORT || 3000, function(){
    console.log("Server started successfully");
});


