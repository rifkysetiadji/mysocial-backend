const express=require('express')
const routes=express.Router()
const threadSchema=require('../models/threadModels')
const userSchema=require('../models/userModels')
const commentSchema=require('../models/commentModels')
const middleware=require('../config/middleware')
//add thread
routes.post('/add',middleware.checkToken,async(req,res)=>{
    const userId=req.decoded
    const newThread=new threadSchema(req.body)
    console.log(newThread)
    const user=await userSchema.findById(userId)
    newThread.user_id=user
    await newThread.save()
    user.threads.push(newThread)
    await user.save()
    res.status(201).json(newThread)
})
//get thread
routes.get('/get-thread/:userid',middleware.checkToken,async(req,res)=>{
    const userId=req.decoded
    const thread=await threadSchema.find({user_id:req.params.userid}).sort({'created_at':-1})
    res.status(200).json(thread)
})
//delete thread
routes.delete('/delete-thread/:threadId',middleware.checkToken,async(req,res)=>{
    const {threadId}=req.params
    const userId=req.decoded
    const user=await userSchema.findByIdAndUpdate(userId,{$pull:{threads:threadId}})
    const thread=await threadSchema.findByIdAndDelete(threadId)
    res.status(200).json({message:'success'})
})
//like thread
routes.post('/like-thread/:threadId',middleware.checkToken,async(req,res)=>{
    const {threadId}=req.params
    let thread=await threadSchema.findByIdAndUpdate(threadId,{$inc:{likes:1}})
    res.status(200).json(thread)

})
//unlilike thread
routes.post('/unlike-thread/:threadId',middleware.checkToken,async(req,res)=>{
    const {threadId}=req.params
    let thread=await threadSchema.findByIdAndUpdate(threadId,{$inc:{likes:-1}})
    res.status(200).json(thread)

})


//comment thread
routes.post('/add-comment/:threadId',middleware.checkToken,async(req,res)=>{
    const userId=req.decoded
    const threadId=req.params.threadId
    const comment=new commentSchema(req.body)
    const thread=await threadSchema.findById(threadId)
    const user=await userSchema.findById(userId)
    comment.thread_id=thread
    comment.user_id=user
    await comment.save()
    thread.comment.push(comment)
    await thread.save()
    res.status(201).json(comment)
})
//get thread comment
routes.get('/comment/:threadId',middleware.checkToken,async(req,res)=>{
    const threadId=req.params.threadId
    const comment=await threadSchema.findById(threadId).populate('comment')
    res.status(200).json(comment)
})
//delete comment 
routes.delete('/delete-comment/:threadId/:commentId',middleware.checkToken,async(req,res)=>{
    const {commentId,threadId}=req.params
    const thread=await threadSchema.findByIdAndUpdate(threadId,{$pull:{comment:commentId}})
    const comment=await commentSchema.findByIdAndDelete(commentId)
    res.status(200).json({message:'success'})
})



//get thread from all followers
routes.get('/timeline',middleware.checkToken,async(req,res)=>{
    let userId=req.decoded
    let user=await userSchema.findById(userId)
    let thread=await threadSchema.find({'user_id':{$in:[user.following]}}).sort({"created_at":-1}).limit(1)
    res.status(200).json(thread)
})
module.exports=routes