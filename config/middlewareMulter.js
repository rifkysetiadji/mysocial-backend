// const multer=require('multer')
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//       console.log(file)
//       cb(null, file.originalname)
//     }
//   })
var multer = require('multer');
var path = require('path');

//multer.diskStorage() creates a storage space for storing files. 
var storage = multer.diskStorage({
    destination:function(req, file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, path.join(__dirname + './../public/uploads/'));
        }else{
            cb({message: 'this file is neither a video or image file'}, false)
        }
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
var upload = multer({storage:storage}).any();
module.exports = upload;
