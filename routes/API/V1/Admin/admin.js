const express = require('express');
const routs = express.Router();
const passport = require('passport');

// Require modules
const adminController = require('../../../../controller/API/V1/Admin/adminController');
const register = require('../../../../model/Admin/register');

routs.post('/register',register.uploadImage,adminController.register);
routs.post('/login', adminController.login);


routs.get('/failLogin', async (req, res) => {
    return res.status(200).json({ msg: "Login Failed", status: 0 });
});

routs.get('/profile',passport.authenticate('jwt', {failureRedirect : '/admin/failLogin'}), adminController.profile);
routs.put('/editProfile/:id', passport.authenticate('jwt', { failureRedirect: '/admin/failLogin' }), register.uploadImage ,adminController.editProfile);

routs.get('/getAllManagerDetails', passport.authenticate('jwt', { failureRedirect: '/admin/failLogin' }), adminController.getAllManagerDetails);


// require routes
routs.use('/manager', require('../Manager/manager'));
routs.use('/permission',passport.authenticate('jwt', {failureRedirect : '/admin/failLogin'}), require('../Admin/permisssion'));

module.exports = routs;