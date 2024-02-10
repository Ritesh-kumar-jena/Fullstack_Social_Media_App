const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    gender:{type:String,required:true},
    password:{type:String,required:true}
},{versionKey:false})
const UserModel=mongoose.model('users',userSchema)

const postSchema=mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    device:{type:String,required:true},
    userName:{type:String},
    userID:{type:String},
    postDate:{type:Date}

},{versionKey:false})
const Post=mongoose.model("posts",postSchema)

const blacklisting=mongoose.Schema({
   token:{type:String},
   reftoken:{type:String}
},{versionKey:false})

const Blacklisting=mongoose.model("BlacklistedToken",blacklisting)

module.exports={UserModel,Post,Blacklisting}