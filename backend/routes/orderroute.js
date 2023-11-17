const express=require("express")
const router=express.Router()
const {neworder,getSingleOrder,myOrders, getAllOrder,
    updateOrder,deleteOrder}=require("../controllers/ordercontroller")
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth")

router.route("/order/new").post(isAuthenticatedUser,neworder)

router.route("/order/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleOrder)

router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/orders/me").get(isAuthenticatedUser,myOrders);


router.route("/admin/orders").get(isAuthenticatedUser,authorizedRoles("admin"),getAllOrder)

router.route("/admin/order/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateOrder)
.delete(isAuthenticatedUser,authorizedRoles("admin"),deleteOrder)

module.exports=router;

