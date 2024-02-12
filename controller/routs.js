const express=require('express')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const {UserModel,Post,Blacklisting}=require('../model/userModel')
const userRouts=express.Router()
const mangoose=require('mongoose')
const jwt=require('jsonwebtoken')
const { model } = require('mongoose')
const {auth}=require('../middleware/auth')
const{postRouts}=require('./postRouts')
userRouts.post('/register',async(req,res)=>{
    try {
        const {name,email,gender,password}=req.body
        bcrypt.hash(password,5,async function(err,hash){
           if(err){
            res.send({msg:"error whill hashing the password"})
           }
           else{
            const user=new UserModel({name,email,gender,password:hash})
            await user.save()
            res.status(200).send({msg:"Your registration successfull=>go to login page"})
           }
        })
    } catch (error) {
        res.status(400).send({error:error})
    }
})

userRouts.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try {
        const user= await UserModel.findOne({email})
    if(user){
        bcrypt.compare(password,user.password,function(err,result){
          if(result){
            const token=jwt.sign({userID:user._id,username:user.name},"masai",{expiresIn:"1h"})
            res.cookie('token',token,{httpOnly:true,maxAge:60*60*1000})
            const reftoken=jwt.sign({userID:user._id,userName:user.name},"school",{expiresIn:"1h"})
            res.cookie('reftoken',reftoken,{httpOnly:true,maxAge:7*24*60*60*1000})
            res.send({msg:"login successfull",token:token})
          }else{
            res.send({msg:"wrong password"})
          }
        })
    }else{
        res.send({msg:"plz sigin first wrong email"})
    }
    } catch (error) {
       res.status(400).send(error)
    }   
})
userRouts.get('/logout',async(req,res)=>{
     try {
        const token=req.cookies.token
        const reftoken=req.cookies.reftoken
        const BlacklistedToken=new Blacklisting({token,reftoken})
        await BlacklistedToken.save()
        res.clearCookie('token')
        res.clearCookie('reftoken')
        res.status(200).send({msg:"logout successfull"})
     } catch (error) {
       res.status(400).send(error)
     }
})
userRouts.get('/newtoken',async(req,res)=>{
    try {
        const reftoken=req.cookies.reftoken
        const block=await Blacklisting.findOne({reftoken})
        if(block){
            res.send({msg:"plz login first"})
        }else{
            if(reftoken){
                jwt.verify(reftoken,'school',async(err,decoded)=>{
                    if(decoded){
                       const token=req.cookies.token
                     const oldtoken=new Blacklisting({token})
                     await oldtoken.save()
                     res.clearCookie("token")
                     const newtoken=jwt.sign({userName:decoded.userName,userID:decoded.userID},"masai",{expiresIn:"1h"})
                     res.cookie('token',newtoken,{httpOnly:true,maxAge:60*60*1000})
                     res.send({masg:token})
                    }
                    else{
                        res.send({err:err})
                    }
                })
            }
        }           

    } catch (error) {
        res.send({error:error})
    }
})

module.exports={userRouts}