const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    caption:{
        type:String
    },
    file:{
        type:String,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    likes:{
        type:Number,
        default:0
    },
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
})
module.exports=mongoose.model('Thread',userSchema)