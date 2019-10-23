const express=require('express')
const routes=express.Router()
const UserSchema=require('../models/userModels')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const secret=require('../config/secret')
const middleware=require('../config/middleware')
const axios =require('axios')
const upload=require('../config/middlewareCloudinary')
const multer=require('../config/middlewareMulter')
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'mahlul-technology',
    api_key: '961414385979978',
    api_secret: 'VAcW1TkfS8WXbb4ttJmCLYZucSg'
});


//login
routes.get('/test',(req,res)=>{
    res.json('asdf')
})
routes.post('/login',(req,res)=>{
    // console.log('login',req.body)
    // res.json('asdfsdf')
    UserSchema.findOne({email:req.body.email},(err,result)=>{
        
        if(result){
            let passDecript= bcrypt.compareSync(req.body.password,result.password)
            if(passDecript){
                let token=jwt.sign({id:result._id},secret.secret,{
                    expiresIn:86400000
                })
                res.send({auth:true,token:token})
            }else{
                res.status(401).send({auth:false,message:'wrong password'})
            }
        }else{
            res.status(401).send({auth:false,message:'email not found'})
        }
        
    })
})
//register5d91f504bd9bd502b31c8e26
routes.post('/register',(req,res)=>{
    passEncrypt=bcrypt.hashSync(req.body.password)
    let data={
        name:req.body.name,
        email:req.body.email,
        password:passEncrypt
    }
    UserSchema.create(data,(err,result)=>{
        if(err) res.send({auth:false,message:err})
            // console.log('pass',result[0].password)
        res.send({message:'created success'})
    })
})

//get profile for self
routes.get('/home/profile/',middleware.checkToken,(req,res)=>{
    console.log('get /home/profile')
    try {
        UserSchema.findById(req.decoded,(err,result)=>{
            if(result!==null){
                res.send({message:'get success',user:result})

            }else{
                res.status(404).send({message:'profile not found',user:null})

            }
        })
    } catch (error) {
        console.log(error)
    }
    
})
//get profile
routes.get('/profile/:id',middleware.checkToken,(req,res)=>{
    try {
        UserSchema.findById(req.params.id,(err,result)=>{
            let isFollowing= UserSchema.find({followers:{$in:req.decoded}})
            console.log('dd',isFollowing)
            if(req.decoded===req.params.id){
                res.send({message:'get success',user:result,self:true})

            }else{
                res.send({message:'get success',user:result,self:false})

            }
            
        })
    } catch (error) {
        console.log(error)
    }
    
})

//user search
routes.get('/user/:keywoard',middleware.checkToken,async(req,res)=>{
    let user=await UserSchema.find({"name":{'$regex':req.params.keywoard}})

    res.status(200).json({message:'get succes',user:user})
})

//add-club
routes.put('/club-add',middleware.checkToken,(req,res)=>{
    try {
        console.log('req',req.body)
        UserSchema.findByIdAndUpdate(req.decoded,{club_favorit:req.body},(err,result)=>{
            res.send({message:'created success'})
            
        })
    } catch (error) {
        console.log(error)
    }
   
})
//follow
routes.post('/follow/:followingId',middleware.checkToken,async(req,res)=>{
    let userId=req.decoded
    let {followingId}=req.params
    let user=await UserSchema.findById(userId)
    let folowing=await UserSchema.findById(followingId)
    folowing.followers.push(user)
    user.following.push(folowing)
    await user.save()
    await folowing.save()
    res.status(200).json({message:'following success'})
})

//unfollow
routes.post('/unfollow/:followingId',middleware.checkToken,async(req,res)=>{
    let {followingId}=req.params
    let userId=req.decoded
    let user=await UserSchema.findByIdAndUpdate(userId,{$pull:{following:followingId}})
    let following=await UserSchema.findByIdAndUpdate(followingId,{$pull:{followers:userId}})
    res.status(200).json({message:'unfollowing success'})

})

//get followers
routes.get('/followers/:id',middleware.checkToken,async(req,res)=>{
    let userId=req.decoded
    let user =await UserSchema.findById(req.params.id).populate('followers')
    res.status(200).json({message:'success',user:user.followers})
})

//get following
routes.get('/following/:id',middleware.checkToken,async(req,res)=>{
    let userId=req.decoded
    let user =await UserSchema.findById(req.params.id).populate('following')
    res.status(200).json({message:'success',user:user.following})
})

routes.post('/update-ava',middleware.checkToken,multer,async(req,res)=>{
    try {
        cloudinary.uploader.upload(req.files[0].path,async(result,err)=>{
            let userId=req.decoded
            await UserSchema.findByIdAndUpdate(userId,{avatar_url:result.secure_url})
            res.status(201).json({message:'success'})
         })  
    } catch (error) {
        res.status(500).send({error:error})
    }
    
})
routes.put('/update-profile',middleware.checkToken,async(req,res)=>{
    let userId=req.decoded
    let user =await UserSchema.findByIdAndUpdate(userId,{name:req.body.name})
    res.status(201).json({message:'success',user:user})

})
module.exports=routes