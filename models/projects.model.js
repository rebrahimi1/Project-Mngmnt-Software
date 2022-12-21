const mongoose = require("mongoose");

const projSchema = new mongoose.Schema({
    key: String,
    name: String,
    desc: String,
    owner: String,
    risks: [{riskdes: String, status: String, pida: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'}}]
});

module.exports = mongoose.model('Project', projSchema);