const express = require('express');
const router = express.Router();
const projectService = require('../services/project.service');


router.get('/home', getDashboard);
router.get('/project', getProjects);
router.get('/status', getStatuses);



router.post('/home', goToDashboard);
router.post('/newp', addNewProject);
router.post('/addrisks', addRisk);
router.post('/changeStatus', changeStatus);
router.post('/riskdel', removeRisk);
router.post('/newmbr', addMember);
router.post('/rmvmbr', removeMember);

module.exports = router;

async function getDashboard(req, res) {
    let dashboard = await projectService.getDashboard(req.user.id, req.user.key);
    res.render('home', {userInfo: dashboard.user, projInfo: dashboard.project, key: dashboard.key});
}

async function goToDashboard(req, res) {
    res.redirect('/home');
}

async function addNewProject(req, res) {
    await projectService.newProject(req.body);
    res.redirect('/home');
}

async function getProjects(req, res) {
    let result = await projectService.getAllProjects(req.query.pid, req.user.id);
    res.render('project', {projInfo: result.projects, pIde: req.query.pid, mbrInfo: result.members, usInfo: result.user});
}

async function getStatuses(req, res) {
    let result = await projectService.getStatuses(req.query.pid, req.user.id);
    res.render('status', {projInfo: result.project, pIde: req.query.pid, usInfo: result.user});
}

async function addRisk(req, res) {
    await projectService.addRisk(req.body);
    res.redirect(`/status?pid=${req.body.pid}`);
}

async function changeStatus(req, res) {
    await projectService.changeStatus(req.body);
    res.redirect(`/status?pid=${req.body.pid}`);
}

async function removeRisk(req, res) {
    await projectService.removeRisk(req.body);
    res.redirect(`/status?pid=${req.body.pid}`);
}

async function addMember(req, res) {
    await projectService.addMember(req.body);
    res.redirect(`/project?pid=${req.body.pid}`);
}

async function removeMember(req, res) {
    await projectService.removeMember(req.body.pid);
    res.redirect(`/project?pid=${req.body.pid}`);
}
