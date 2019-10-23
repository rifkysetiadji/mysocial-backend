const express=require('express')
const routes=express.Router()
const threadSchema=require('../models/threadModels')
const userSchema=require('../models/userModels')
const commentSchema=require('../models/commentModels')
const middleware=require('../config/middleware')
const moment=require('moment')
//add thread
routes.post('/add',middleware.checkToken,async(req,res)=>{
    const userId=req.decoded
    let now=moment()
    // let data={
    //     caption:req.body.caption,
    //     created_at:moment(now,'MM DD YYYY')
    // }
    const newThread=new threadSchema(req.body)
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
    let following_id=user.following.map(id=>{return id})
    let now=moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm')
    let tomorow=moment().add(1,'d').format('YYYY-MM-DD HH:mm')
    let date=new Date(Date.now() - 24*60*60 * 1000)

    // let thread=await threadSchema.find({'created_at':{$gt:new Date(Date.now() - 24*60*60 * 1000)}}).sort({"created_at":-1})
    let a=[]
    let thread=await threadSchema.find({'user_id':{$in:following_id}}).populate('user_id').sort({"created_at":-1}).then(async (res)=>{
        res.map(d=>{
            // console.log(moment(d.created_at).format('dd/mm/YYYY'))
            let created_at=moment(d.created_at).format('YYYY-MM-DD HH:mm')
            let result=moment(created_at).isAfter(now)
            if(result===true){
                a.push(d)
            }
        })
        await threadSchema.find({'user_id':{$in:userId}}).populate('user_id').sort({"created_at":-1}).then(res=>{
            res.map(d=>{
                let created_at=moment(d.created_at).format('YYYY-MM-DD HH:mm')
                let result=moment(created_at).isAfter(now)
                if(result===true){
                    a.push(d)
                }
            })
           
        })
    })

    // let thread=await threadSchema.find({$and:[{'created_at':{$gt:date}},{'user_id':{$in:following_id}}]})
    // let thread=await threadSchema.find({
    //     'user_id':{$in:following_id},
    //     'created_at':{$gt:new Date(Date.now() - 24*60*60 * 1000)}
    // })

    res.status(200).json(a )
})
module.exports=routes