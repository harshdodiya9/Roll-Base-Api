const express = require('express');
const routs = express.Router();
const passport = require('passport');

const managerController = require('../../../../controller/API/V1/Manager/managerController');
const manager = require('../../../../model/manager/manager');

routs.post('/addManager', passport.authenticate('jwt', { failureRedirect: '/admin/manager/failLogin' }), manager.uploadImage, managerController.addManager);
routs.post('/login', managerController.login);
routs.get('/getAllManagerData',passport.authenticate('manager', {failureRedirect : '/admin/manager/failManagerLogin'}), managerController.getAllManagerData);

routs.get('/failManagerLogin', async (req, res) => {
    return res.status(200).json({ msg: "Login Failed", status: 0 });
});

routs.get('/managerProfile', passport.authenticate('manager', { failureRedirect: '/admin/manager/failLogin' }), managerController.managerProfile);

routs.put('/EditmanagerProfile/:id', passport.authenticate('manager', { failureRedirect: '/admin/manager/failLogin' }), manager.uploadImage, managerController.EditmanagerProfile);

routs.get('/getAllUserData', passport.authenticate('manager', { failureRedirect: '/admin/manager/failLogin' }), managerController.getAllUserData);

routs.get('/failLogin', async (req, res) => {
    return res.status(200).json({ msg: "Login Failed by manager", status: 0 });
});

module.exports = routs;