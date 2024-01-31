const manager = require('../../../../model/manager/manager');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwtData = require('jsonwebtoken');
const path = require('path')
const fs = require('fs')
const userModel = require('../../../../model/User/user');
const register = require('../../../../model/Admin/register');


// edjxllvuhtqaocac

module.exports.addManager = async (req, res) => {
    try {
        let checkEmail = await manager.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(200).json({ msg: "Email is already exist", status: 0 });
        }
        else {
            let password = req.body.password;
            let ManagerImg = '';
            if (req.file) {
                ManagerImg = manager.imagesPath + "/" + req.file.filename;
            }
            req.body.image = ManagerImg;
            req.body.adminId = req.user.id;
            req.body.password = await bcrypt.hash(req.body.password, 10);
            let managerData = await manager.create(req.body);
            if (managerData) {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                        user: "dodiyaharsh99@gmail.com",
                        pass: "fboskkbxwniawsiz",
                    },
                });

                const info = await transporter.sendMail({
                    from: 'dodiyaharsh99@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: "Here is your Id and Password", // Subject line
                    text: "Email and PAssword", // plain text body
                    html: `<b> Your email : ${req.body.email}</b> <br> <b>Password : ${password}</b>`, // html body
                });

                let reg = await register.findById(req.user.id);
                reg.managerIds.push(managerData.id);
                await register.findByIdAndUpdate(req.user.id,reg)
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
    try {
        let checkData = await manager.findOne({ email: req.body.email });
        if (checkData) {
            if (await bcrypt.compare(req.body.password, checkData.password)) {
                let token = jwtData.sign({ ManagerData: checkData }, 'Manager', { expiresIn: '1h' });
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

module.exports.getAllManagerData = async (req, res) => {
    try {
        let allManagerData = await manager.find({});
        if (allManagerData) {
            return res.status(200).json({ msg: "All Manager Data", status: 1, Manager: allManagerData });
        }
        else {
            return res.status(200).json({ msg: "Record not found", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.managerProfile = async (req, res) => {
    try {
        const  managerdata = await manager.findById(req.user.id).populate('adminId').exec();
    
        if (managerdata) {
            return res.status(200).json({ msg: "Your Profile", status: 1, Profile: managerdata });
        }
        else {
            return res.status(200).json({ msg: "Record not found", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.EditmanagerProfile = async (req, res) => {
    try {
        // console.log(req.file);
        // console.log(req.params.id);
        if (req.file) {
            let oldImg = await manager.findById(req.params.id);
            console.log(oldImg);
            if (oldImg.image) {
                let fullPath = path.join(__dirname, "../../../..", oldImg.image);
                console.log(fullPath);
                await fs.unlinkSync(fullPath);
            }
            var imgPath = '';
            imgPath = manager.imagesPath + "/" + req.file.filename;
            req.body.image = imgPath;
        }
        else {
            let olddata = await manager.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        let managerupdate = await manager.findByIdAndUpdate(req.params.id, req.body);
        if (managerupdate) {
            let upManager = await manager.find({});
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, Manager: upManager });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}

module.exports.getAllUserData = async (req, res) => {
    try {
        let userData = await userModel.find({});
        if (userData) {
            return res.status(200).json({ msg: "Here All User Details", status: 1, UserDetails: userData });
        }
        else {
            return res.status(200).json({ msg: "Record not found", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "Something wrong", status: 0 });
    }
}