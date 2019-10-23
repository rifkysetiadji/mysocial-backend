const cloudinary = require('cloudinary');
const multer=require('./middlewareMulter')
cloudinary.config({
    cloud_name: 'mahlul-technology',
    api_key: '961414385979978',
    api_secret: 'VAcW1TkfS8WXbb4ttJmCLYZucSg'
});
let upload=(req,next,res)=>{
    multer().then((res)=>{
        console.log(res)
    })
}
module.exports=upload
