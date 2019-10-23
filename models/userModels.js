const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique: true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar_url:{
        type:String,
        default:null
    },
    threads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Thread'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    club_favorit:[],
})
module.exports=mongoose.model('User',userSchema)