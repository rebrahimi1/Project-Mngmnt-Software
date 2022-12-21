const {
    Project,
    Member,
    Requirement
} = require('../models/index');

const User = require('../models/users.model');



async function getAllRequirements(projectId, userId) {
    let project = await Project.findById(projectId).exec();
    let requirements = await Requirement.find({pid: projectId}).exec();
    let members = await Member.find({pid: projectId}).exec();
    let user = await User.findById(userId).exec();

    return {project, requirements, members, user, projectId};
}

async function addRequirement(body) {
    const addNewRq = new Requirement({
        pid: body.pid,
        funcreq: body.reqttl,
        assigne: body.asgne,
        details: body.reqdsc
    });

    addNewRq.save();
}

async function changeMember(body) {
    await Requirement.findOneAndUpdate({_id: body.cgmbr}, {$set: {assigne: body.asgnch}}).exec();
}

async function changeProgress(body) {
    await Requirement.findOneAndUpdate({_id: body.cgst}, {$set: {progress: body.reqst}}).exec();
}

async function removeRequirement(body) {
    await Requirement.findByIdAndDelete(body.reqrv).exec();
}

async function getMonitoring(projectId, userId) {
    let project = await Project.findById(projectId).exec();
    let requirements = await Requirement.find({pid: projectId}).exec();
    let members = await Member.find({pid: projectId}).exec();
    let user = await User.findById(userId).exec();

    return {project, requirements, members, user, projectId};
}

async function addMonitoring(body) {
    await Requirement.findOneAndUpdate({funcreq: body.reqid}, {$set: {design: body.dsghr, reqanlsys: body.anlhr, coding: body.cdhr, testing: body.tsthr, pm: body.mghr}}).exec();
}

async function updateReqHr(body) {
    await Requirement.findOneAndUpdate({_id: body.reqhr}, {$set: {reqanlsys: body.anlhrs}}).exec();
}

async function updateDesignHr(body) {
    await Requirement.findOneAndUpdate({_id: body.dghr}, {$set: {design: body.dsghrs}}).exec();
}

async function updateCodingHr(body) {
    await Requirement.findOneAndUpdate({_id: body.cdhr}, {$set: {coding: body.cdhrs}}).exec();
}

async function updateTestingHr(body) {
    await Requirement.findOneAndUpdate({_id: body.tshr}, {$set: {testing: body.tshrs}}).exec();
}

async function updateManagementHr(body) {
    await Requirement.findOneAndUpdate({_id: body.pmhr}, {$set: {pm: body.pmhrs}}).exec();
}

async function removeMonitoring(body) {
    await Requirement.findByIdAndDelete(body.rmvmt).exec();
}



module.exports = {
    getAllRequirements,
    addRequirement,
    changeMember,
    changeProgress,
    removeRequirement,
    getMonitoring,
    addMonitoring,
    updateReqHr,
    updateDesignHr,
    updateCodingHr,
    updateTestingHr,
    updateManagementHr,
    removeMonitoring
};