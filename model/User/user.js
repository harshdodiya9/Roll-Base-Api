const mongoose = require('mongoose');
const imagePath =  '/uploads/User';
const path = require('path');
const  multer = require('multer');

const userSchema = mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    userImage : {
        type : String
    }
});

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,path.join(__dirname,'../..',imagePath));
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now());
    }
})

userSchema.statics.uploadImage = multer({ storage : storage }).single('userImage');
userSchema.statics.imagesPath = imagePath;

const user = mongoose.model('User', userSchema);
module.exports = user