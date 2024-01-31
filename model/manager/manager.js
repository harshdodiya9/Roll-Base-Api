const mongoose = require('mongoose');
const imagePath =  '/uploads/Manager';
const path = require('path');
const  multer = require('multer');

const ManagerSchema = mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    image : {
        type : String
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required : true
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

ManagerSchema.statics.uploadImage = multer({ storage : storage }).single('image');
ManagerSchema.statics.imagesPath = imagePath;

const manager = mongoose.model('Manager', ManagerSchema);
module.exports = manager