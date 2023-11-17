const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth")
const { getallproducts, createproduct, updateproduct, deleteproduct, 
    getproductdetails,createproductreview,getproductreviews,deletereviews} = require("../controllers/productcontroller");

router.route("/products").get(getallproducts)

router.route("/products/new").post(isAuthenticatedUser,authorizedRoles("admin"),createproduct)

router.route("/products/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateproduct)

router.route("/productsdelete/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteproduct)

router.route("/productsgetdetail/:id").get(getproductdetails)

router.route("/review").put(isAuthenticatedUser,createproductreview)


router.route("/reviews").get(getproductreviews).delete(isAuthenticatedUser,deletereviews)
module.exports = router