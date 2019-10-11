const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/mysocial').then(()=>console.log('mongodb connected'))
    .catch((err)=>{
        console.log(err)
    })