const mongoose=require('mongoose')
const dotenv=require('dotenv').config()
const connection=mongoose.connect(process.env.MongoUrl)

module.exports={connection}