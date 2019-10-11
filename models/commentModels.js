const mongoose=require('mongoose')
const CommentSchema=mongoose.Schema({
    body:{
        type:String,

    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    thread_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Comment',CommentSchema)