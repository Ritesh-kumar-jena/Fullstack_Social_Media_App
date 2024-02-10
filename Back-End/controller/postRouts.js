const express=require('express')
const cookieParser=require('cookie-parser')
const bcrypt=require('bcrypt')
const {UserModel,Post,Blacklisting}=require('../model/userModel')
const postRouts=express.Router()
const mangoose=require('mongoose')
const jwt=require('jsonwebtoken')
const { model } = require('mongoose')
const {auth}=require('../middleware/auth')
const {userRouts}=require('./routs')

postRouts.post('/add',auth,async(req,res)=>{
    try {
        const data=req.body
        const posts=new Post(data)
        await posts.save()
        res.status(200).send({msg:"your Post has been add"})
    } catch (error) {
        res.status(400).send(error)
    }
})

postRouts.get("/",auth,async(req,res)=>{
    const {device,device1,device2}=req.query
    try {
        if(device&&!device1&&!device2){
            const data=await Post.find({$and:[{userID:req.body.userID},{device:{$regex:device,$options:'i'}}]})
            if(data.length===0){
                    res.status(400).send({msg:"invalid query"})
                }else{
                    res.send(data)
                }    
        }
        else if(device1&&device2){
            const data=await Post.find({$and:[{userID:req.body.userID},{$and:[{device:{$regex:device1,$options:'i'}},{device:{$regex:device2,$options:'i'}}]}]})
            if(data.length===0){
                    res.status(400).send({msg:"invalid query"})
                }else{
                    res.send(data)
                }    
        }
        else{
            const data=await Post.find({userID:req.body.userID})
            res.status(200).send(data)
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

postRouts.patch('/update/:ID',auth,async(req,res)=>{
    const {ID}=req.params
    const update=req.body
    try {
        const data=await Post.findOne({_id:ID})
        if(req.body.userID===data.userID){
           await Post.findByIdAndUpdate({_id:ID},update)
           res.status(200).send({msg:"your post has been updated"})
        }else{
            res.send({msg:"you are not authorize to update this post"})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

postRouts.delete('/delete/:ID',auth,async(req,res)=>{
    const {ID}=req.params
    try {
        const data=await Post.findOne({_id:ID})
        if(req.body.userID===data.userID){
           await Post.findByIdAndDelete({_id:ID})
           res.status(200).send({msg:"your post has been deleted"})
        }else{
            res.send({msg:"you are not authorize to delete this post"})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})


module.exports={postRouts}