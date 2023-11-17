const express=require("express")
const router=express.Router()

const { registeruser,loginuser,logout,forgotpassword,resetpassword,
    getuserdetail, updatepassword,updateProfile,getalluser,getsingleuser,
    updateuserrole,deleteuser }=require("../controllers/usercontroller")

const {isAuthenticatedUser,authorizedRoles}=require("../middleware/auth")
router.route("/register").post(registeruser)
router.route("/login").post(loginuser)

router.route("/password/forgot").post(forgotpassword);
router.route("/password/reset/:token").put(resetpassword);
router.route("/logout").get(logout)

router.route("/me").get(isAuthenticatedUser,getuserdetail)
router.route("/password/update").put(isAuthenticatedUser,updatepassword)

router.route("/me/update").put(isAuthenticatedUser,updateProfile)


router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getalluser)

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getsingleuser)
.put(isAuthenticatedUser,authorizedRoles("admin"),updateuserrole)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteuser)






module.exports=router;