const express = require('express');
const routs = express.Router();
const adminController = require('../../../../controller/API/V1/Admin/adminController');

routs.get('/getAllAdminData',adminController.getAllAdminData);

module.exports = routs;