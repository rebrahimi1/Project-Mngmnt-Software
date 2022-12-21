const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
    pid: {type: mongoose.Schema.Types.ObjectId, ref: 'projSchema'},
    member: String,
    email: String,
    title: String
});

module.exports = mongoose.model('Member', memberSchema);

