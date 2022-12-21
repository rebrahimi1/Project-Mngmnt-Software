const mongoose = require("mongoose");

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

module.exports = mongoose.model('Requirement', reqSchema);