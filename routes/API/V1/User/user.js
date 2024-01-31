const express = require('express');
const routs = express.Router();
const passport = require('passport');

const userController = require('../../../../controller/API/V1/User/userController');
const userModel = require('../../../../model/User/user');

routs.post('/addUser', userModel.uploadImage, userController.addUser);
routs.post('/userLogin', userController.userLogin);

routs.get('/userProfile', passport.authenticate('userData', { failureRedirect: '/user/failLogin' }), userController.userProfile);
routs.get('/failLogin', async (req, res) => {
    return res.status(200).json({ msg: "Login Failed", status: 0 });
});

routs.put('/editProfile/:id', passport.authenticate('userData', { failureRedirect: '/user/failLogin' }), userModel.uploadImage, userController.editProfile);

module.exports = routs;