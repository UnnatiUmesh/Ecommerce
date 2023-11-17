//create a token and save in cookie
const sendToken=(user,statuscode,res)=>
{
    const token=user.getJWTtoken();


    //options for cookie
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRY*24*60*60*1000

        ),
        httpOnly:true,
    }
    res.status(statuscode).cookie("token",token,options).json({
        success:true,
        user,
        token
    })


    
}
module.exports=sendToken