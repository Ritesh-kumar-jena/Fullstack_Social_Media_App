const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const { Blacklisting } = require('../model/userModel')

const auth=async(req,res,next)=>{
    const token=req.cookies.token
       try {
       const block=await Blacklisting.findOne({token})
       if(block){
        req.send({msg:"login first"})
       }
       else{
        jwt.verify(token,"masai",(err,decoded)=>{
            if(decoded){
                req.body.userName=decoded.username
                req.body.userID=decoded.userID
               req.body.postDate=Date.now()
               next()
            }else{
                res.send({msg:"login first"})
            }
        })
       }
       } catch (error) {
        res.status(400).send({msg:"plz login first"})
       }
}
module.exports={auth}