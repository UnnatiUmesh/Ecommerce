const User=require("../models/usermodel")
const errorhandler=require("../utils/errorhandling")
const catchasyncerror=require("../middleware/catchasyncerror")
const sendToken=require("../utils/jwtToken")
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto");
//register the user
exports.registeruser=catchasyncerror(async(req,res,next)=>{
    const {name,email,password}=req.body

    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"This is a sample id",
            url:"Profile pic url"
        },
    });

   sendToken(user,201,res);
        
})


//login user
exports.loginuser=catchasyncerror(async(req,res,next)=>{
    const {email,password}=req.body
if(!email||!password)
return next(new errorhandler("Please enter email and password",400));

const user= await User.findOne({email}).select("+password")

if(!user)
return next(new errorhandler("Invalid email or password",400));
    
const isPasswordMatched=await user.comparepassword(password);

if(!isPasswordMatched)
return next(new errorhandler("Invalid email or password",400));
    

sendToken(user,200,res);
   

        
})


//logout user
exports.logout=catchasyncerror(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"Logged OUT",

    })

}
)

//forgot password
exports.forgotpassword=catchasyncerror(async(req,res,next)=>{
   
    const user=await User.findOne({
        email:req.body.email
    })
    if(!user)
    return next(new errorhandler("user not found"),404)
  

    //get reset password token

    const resetoken=await user.getresetPaaswordToken();
    await user.save({
        validateBeforeSave:false
    })


    const resetpasswordurl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetoken}`

    const message=`your password reset token is : \n\n${resetpasswordurl} \n\n if you have not requested email please 
    ignore it`


    try{
        await sendEmail({
            email:user.email,
            subject:"Ecommerce password recovery",
            message
        })
        
            res.status(200).json({
                success:true,
                message:`Email sent to ${user.email}successfully`
        
            })
    }
    catch(error){
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined

        await user.save({validateBeforeSave:false});
        return next(new errorhandler(error.message,500));

    }
}
)

//reset password
exports.resetpassword=catchasyncerror(async(req,res,next)=>{
const resetPasswordToken=crypto
.createHash("sha256").
update(req.params.token)
.digest("hex");

const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()},
});

if(!user)
{
    return next(new errorhandler("reset password token is invalid or has been expired",500));
}

if(req.body.password!=req.body.confirmPassword)
{
    return next(new errorhandler("Password does not match",500));   
}

user.password=req.body.password;

user.resetPasswordToken=undefined
user.resetPasswordExpire=undefined

await user.save();

sendToken(user,200,res)
})


//get user detail
exports.getuserdetail=catchasyncerror(async(req,res,next)=>{
    const user=await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})



//update user password

exports.updatepassword=catchasyncerror(async(req,res,next)=>{
    const user= await User.findById(req.user.id)
    .select("+password")

    const isPasswordMatched=await user.comparepassword(req.body.oldpassword)

    if(!isPasswordMatched)
    return next(new errorhandler("oldPassword is incorrect",500)); 

    if(req.body.newpassword!==req.body.confirmPassword)
    return next(new errorhandler("Password does not match",500)); 

    user.password=req.body.newpassword
    await user.save()
    sendToken(user,200,res)

})



//update user profile

exports.updateProfile=catchasyncerror(async(req,res,next)=>{
    const newuserdata={
        name:req.body.name,
        email:req.body.email
    }

    //we will add cloudinary later

    const user=await User.findByIdAndUpdate(req.user.id,newuserdata,{
        new:true,
        runValidators:true,
        useFindandModify:false
        
    })

    res.status(200).json({
        success:true
    })
})

//get all users {admin}

exports.getalluser=catchasyncerror(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })

})


//get single user {admin}

exports.getsingleuser=catchasyncerror(async(req,res,next)=>{
    const users=await User.findById(req.params.id)
    res.status(200).json({
        success:true,
        users
    })
})

//update user role --admin
exports.updateuserrole=catchasyncerror(async(req,res,next)=>{
    const newuserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    //we will add cloudinary later

    const user=await User.findByIdAndUpdate(req.params.id,newuserdata,{
        new:true,
        runValidators:true,
        useFindandModify:false
        
    })

    res.status(200).json({
        success:true
    })
})

//delete a user --admin
exports.deleteuser=catchasyncerror(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    
    //we will remove clodinary later
    if(!user)
    {
        return next(new errorhandler(`User does not exist with id : ${req.params.id}`,500)); 
    }

  
    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })
})

