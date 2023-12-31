const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"name should not exceed 30 characters"],
        minLength:[4,"name should not have more than 4 characters"]

    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[8,"password should be more than 8 characters"],
        select:false


    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
    next()
this.password=await bcrypt.hash(this.password,10);
})

//jwt token
userSchema.methods.getJWTtoken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}

//compare password
userSchema.methods.comparepassword=async function(eneteredpassword)
{
    return await bcrypt.compare(eneteredpassword,this.password);
}


//generating password reset token
userSchema.methods.getresetPaaswordToken=async function()
{
 const resettoken=crypto.randomBytes(20).toString("hex");
 
 //hashing and adding reset password token to userSchema
 this.resetPasswordToken=crypto.createHash("sha256").update(resettoken).digest("hex");
 this.resetPasswordExpire=Date.now()+15*60*1000;
 

 return resettoken;
}

module.exports=mongoose.model("User",userSchema);