// const errorhandler=require("../utils/errorhandling");

// module.exports=(err,req,res,next)=>{
//  err.statuscode=err.statuscode || 500;
//  err.message=err.message || "Internal server error";


//  //wrong monodb id error
//  if(err.name==="CastError")
//  {
//     const message=`Resource not found invalid : ${err.path}`;
//     err=new errorhandler(message,400);
    
//  }
//  res.status(err.statuscode).json({
//     success:false,
//     error:err.stack
//  });
// }

const errorhandler = require("../utils/errorhandling");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.message = err.message || "Internal server error";

  // Wrong monodb id error
  if (err.name === "CastError") {
    // Handle the CastError separately, without modifying the error object directly
    const message = `Resource not found invalid : ${err.path}`;
    return res.status(400).json({
      success: false,
      error: message,
    });
  }
   
  //mongoose duplicate key error
  if(err.code===11000)
  {
    const message=`Duplicate ${Object.keys(err.keyValue)} entered`;
    err=new errorhandler(message,400);
  }

  //wrong jwt error
  if(err.name==='JsonWebTokenError')
  {
    const message=`JSON Web token is invalid,try again`;
    err=new errorhandler(message,400);
  }

  //JWT Expire error
  if(err.name==='TokenExpiredError')
  {
    const message=`JSON Web token is expired , try again`;
    err=new errorhandler(message,400);
  }

  res.status(err.statuscode).json({
    success: false,
    error: err.stack
  });
};
