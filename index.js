const express=require('express')
const app=express();
var cors = require("cors");
require('./config/mongoDB')
const bodyParser=require('body-parser')
const auth=require('./routes/user')
const thread=require('./routes/thread')
var path = require('path');
// app.use(cors)
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('./public'))
app.use('/api/auth',auth)
app.use('/api/thread',thread)
app.listen(8000,()=>console.log('listen on 8000'))