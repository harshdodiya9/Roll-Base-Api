const mongoose = require('mongoose');
const imagePath =  '/uploads/Admin';
const path = require('path');
const  multer = require('multer');

const registerSchema = mongoose.Schema({
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
    managerIds: {
        type: Array,
        ref : 'Manager'
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

registerSchema.statics.uploadImage = multer({ storage : storage }).single('image');
registerSchema.statics.imagesPath = imagePath;

const register = mongoose.model('Register', registerSchema);
module.exports = register