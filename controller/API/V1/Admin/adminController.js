const bcrypt = require('bcrypt');
const register = require('../../../../model/Admin/register');
const jwtData = require('jsonwebtoken');
const manager = require('../../../../model/manager/manager');
const fs = require('fs')
const path = require('path')

module.exports.register = async (req, res) => {
    try {
        let checkEmail = await register.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(200).json({ msg: "Email is already exist", status: 0 });
        }
        else {
            let adminImg = '';
            if (req.file) {
                adminImg = register.imagesPath + "/" + req.file.filename;
            }
            req.body.image = adminImg;
            req.body.password = await bcrypt.hash(req.body.password, 10);
            let adminData = await register.create(req.body);
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

module.exports.login = async (req, res) => {
    // console.log(req.body);
    try {
        let checkData = await register.findOne({ email: req.body.email });
        if (checkData) {
            if (await bcrypt.compare(req.body.password, checkData.password)) {
                let token = jwtData.sign({ AdminData: checkData }, 'AJ', { expiresIn: '1h' });
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

module.exports.getAllAdminData = async (req, res) => {
    try {
        let allAdminData = await register.find({});
        if (allAdminData) {
            return res.status(200).json({ msg: "All Admin Data", status: 1, admin: allAdminData });
        }
        else {
            return res.status(200).json({ msg: "Record not found", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.profile = async (req, res) => {
    try {
        let admin = await register.findById(req.user.id).populate('managerIds').exec();
        if (admin) {
            return res.status(200).json({ msg: "Your Profile", status: 1, Profile: admin });
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
    try {
        // console.log(req.file);
        // console.log(req.params.id);
        if (req.file) {
            let oldImg = await register.findById(req.params.id);
            console.log(oldImg);
            if (oldImg.image) {
                let fullPath = path.join(__dirname, "../../../..", oldImg.image);
                console.log(fullPath);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = register.imagesPath + "/" + req.file.filename;
            req.body.image = imgPath;
        }
        else {
            let olddata = await register.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        let adminupdated = await register.findByIdAndUpdate(req.params.id, req.body);
        if (adminupdated) {
            let upAdmin = await register.find({});
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: upAdmin });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.getAllManagerDetails = async (req, res) => {
    try {
        let managerData = await manager.find({});
        if (managerData) {
            return res.status(200).json({ msg: "Here All manager Details", status: 1, ManagerDetails: managerData });
        }
        else {
            return res.status(200).json({ msg: "Record not found", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}