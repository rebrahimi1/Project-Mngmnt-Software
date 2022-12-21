const express = require('express');
const router = express.Router();
const requirementService = require('../services/requirement.service');


router.get('/requirement', getAllRequirements);
router.get('/monitor', getMonitoring);



router.post('/addreq', addRequirement);
router.post('/mbrchange', changeMember);
router.post('/rqstchange', changeProgress);
router.post('/reqremove', removeRequirement);
router.post('/addMont', addMonitoring);
router.post('/changeReqhr', updateReqHr);
router.post('/changeDesg', updateDesignHr);
router.post('/changeCode', updateCodingHr);
router.post('/changetest', updateTestingHr);
router.post('/changepm', updateManagementHr);
router.post('/delmonitor', removeMonitoring);

module.exports = router;




async function getAllRequirements(req, res) {
    let result = await requirementService.getAllRequirements(req.query.pid, req.user.id);
    res.render('requirement', {projInfo: result.project, reqInfo: result.requirements, pIde: req.query.pid, mbrInfo: result.members, mbrInfoz: result.members, usInfo: result.user});
}

async function addRequirement(req, res) {
    await requirementService.addRequirement(req.body);
    res.redirect(`/requirement?pid=${req.body.pid}`);
}

async function changeMember(req, res) {
    await requirementService.changeMember(req.body);
    res.redirect(`/requirement?pid=${req.body.pid}`);
}

async function changeProgress(req, res) {
    await requirementService.changeProgress(req.body);
    res.redirect(`/requirement?pid=${req.body.pid}`);
}

async function removeRequirement(req, res) {
    await requirementService.removeRequirement(req.body);
    res.redirect(`/requirement?pid=${req.body.pid}`);
}

async function getMonitoring(req, res) {
    let result = await requirementService.getMonitoring(req.query.pid, req.user.id);
    res.render('monitor', {projInfo: result.project, reqInfo: result.requirements, reqInfos: result.requirements, pIde: req.query.pid, mbrInfo: result.members, mbrInfoz: result.members, usInfo: result.user});
}

async function addMonitoring(req, res) {
    await requirementService.addMonitoring(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}

async function updateReqHr(req, res) {
    await requirementService.updateReqHr(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}

async function updateDesignHr(req, res) {
    await requirementService.updateDesignHr(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}

async function updateCodingHr(req, res) {
    await requirementService.updateCodingHr(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}

async function updateTestingHr(req, res) {
    await requirementService.updateTestingHr(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}

async function updateManagementHr(req, res) {
    await requirementService.updateManagementHr(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}

async function removeMonitoring(req, res) {
    await requirementService.removeMonitoring(req.body);
    res.redirect(`/monitor?pid=${req.body.pid}`);
}