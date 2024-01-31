const userModel = require('../../../../model/User/user');
const bcrypt = require('bcrypt');
const jwtData = require('jsonwebtoken');
const fs = require('fs');
const path = require('path')

module.exports.addUser = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    try {
        let checkEmail = await userModel.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(200).json({ msg: "Email is already exist", status: 0 });
        }
        else {
            let userImg = '';
            if (req.file) {
                userImg = userModel.imagesPath + "/" + req.file.filename;
            }
            req.body.userImage = userImg;
            req.body.password = await bcrypt.hash(req.body.password, 10);
            let adminData = await userModel.create(req.body);
            if (adminData) {
                return res.status(200).json({ msg: "Data Inserted successfully", status: 1 });
            }
            else {
                return res.status(200).json({ msg: "Data not inserted", status: 0 });
            }
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.userLogin = async (req, res) => {
    try {
        let checkData = await userModel.findOne({ email: req.body.email });
        if (checkData) {
            if (await bcrypt.compare(req.body.password, checkData.password)) {
                let token = jwtData.sign({ UserData: checkData }, 'User', { expiresIn: '1h' });
                return res.status(200).json({ msg: "Login Successfully...!", status: 1, record: token });
            }
            else {
                return res.status(200).json({ msg: "Password Does not match", status: 0 });
            }
        }
        else {
            return res.status(200).json({ msg: "Email not match", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.userProfile = async (req, res) => {
    try {
        let userData = await req.user;
        if (userData) {
            return res.status(200).json({ msg: "Your Profile", status: 1, Profile: userData });
        }
        else {
            return res.status(200).json({ msg: "Record not found", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.editProfile = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    try {
        if (req.file) {
            let oldImg = await userModel.findById(req.params.id);
            if (oldImg.userImage) {
                let fullPath = path.join(__dirname, "../../../..", oldImg.userImage);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = userModel.imagesPath + "/" + req.file.filename;
            req.body.userImage = imgPath;
        }
        else {
            let olddata = await userModel.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.userImage;
            }
            req.body.userImage = imgpath;
        }
        let userUpdate = await userModel.findByIdAndUpdate(req.params.id, req.body);
        if (userUpdate) {
            let upUser = await userModel.find({})
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: upUser });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}