const express=require('express')
const app=express();
var cors = require("cors");
require('./config/mongoDB')
const bodyParser=require('body-parser')
const auth=require('./routes/user')
const thread=require('./routes/thread')
var path = require('path');
const dotenv = require('dotenv');
dotenv.config();
// app.use(cors)
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('./public'))
app.use('/api/auth',auth)
app.use('/api/thread',thread)
app.listen(process.env.PORT,()=>console.log(`server running on ${process.env.PORT}`))