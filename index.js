const path=require('path')
const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const dotenv=require('dotenv').config()
const {connection}=require('./db')
const port=process.env.port
const {userRouts}=require('./controller/routs')
const{postRouts}=require('./controller/postRouts')

const app=express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.status(200).send("WEllcome to the app")
})

app.use('/users',userRouts)
app.use('/posts',postRouts)


app.listen(port,async()=>{
    try {
        await connection
        console.log(`server is running on port${port} and connected to the database`)
    } catch (error) {
        console.log(error)
    }
})