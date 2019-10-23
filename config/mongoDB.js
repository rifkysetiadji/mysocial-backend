const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost:27017/mysocial').then(()=>console.log('mongodb connected'))
    .catch((err)=>{
        console.log(err)
    })

    // const mongoose=require('mongoose')
    // mongoose.connect('mongodb+srv://mahlul:mahlul@mysocial-0xyti.mongodb.net/mysocial?retryWrites=true&w=majority').then(()=>console.log('mongodb connected'))
    //     .catch((err)=>{
    //         console.log(err)
    //     })