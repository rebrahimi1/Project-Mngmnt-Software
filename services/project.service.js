const {
    Project,
    Member
} = require('../models/index');

const User = require('../models/users.model');


async function getDashboard(userId, key) {
    let user = await User.findById(userId).exec();
    let project = await Project.find({key: key}).exec();
    return {user, project, key};
}


async function newProject(project) {
    let newProject = new Project({
        key: project.key,
        name: project.name,
        desc: project.desc,
        owner: project.owner
    });
    newProject.save();
    return newProject;
}


async function getAllProjects(projectId, userId) {

    let projects = await Project.findById(projectId).exec();

    let members = await Member.find({pid: projectId}).exec();

    let user = await User.findById(userId).exec();

    return {projects, members, user, projectId};

}

async function getStatuses(projectId, userId) {
    let project = await Project.findById(projectId).exec();
    let user = await User.findById(userId).exec();

    return {project, user, projectId};
}

async function addRisk(body) {
    await Project.findOneAndUpdate({_id: body.pid}, {$push: {risks: [{riskdes: body.rskdesc, status: body.sts, pida: body.pid}]}}).exec();
    return body.pid;
}

async function changeStatus(body) {
    await Project.findOneAndUpdate(
        {
          "risks._id": body.stid},
          {$set:{'risks.$.status': body.statuses}
        }
    ).exec();
    
    return body.pid;
}

async function removeRisk(body) {
    await Project.updateMany({}, {$pull: {risks: {_id: body.rmv9}}}).exec();
    return body.pid;
}

async function addMember(member) {
    let newMember = new Member({
        pid: member.pid,
        member: member.mbnm,
        email: member.mbemail,
        title: member.mbttl
    });
    newMember.save();
}

async function removeMember(projectId) {
    await Member.findOneAndDelete({pid: projectId}).exec();
}


module.exports = {
    getDashboard,
    newProject,
    getAllProjects,
    getStatuses,
    addRisk,
    changeStatus,
    removeRisk,
    addMember,
    removeMember
}