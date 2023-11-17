const errorhandler=require("../utils/errorhandling");
const catchasyncerror=require("./catchasyncerror");

const jwt=require("jsonwebtoken");
const User=require("../models/usermodel")

exports.isAuthenticatedUser=catchasyncerror(async (req,res,next)=>{
    const {token}=req.cookies;

    if(!token)
    return next(new errorhandler("Please login to access this resource",401));

    const decodeddata=jwt.verify(token,process.env.JWT_SECRET);

    req.user=await User.findById(decodeddata.id);

    next()
})

exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            console.log(req.user.role)
            return next(new errorhandler(
                    `Role:${req.user.role} is not allowed access this resource`,
                    403
            )
        )
        }
        next();
    }
}

