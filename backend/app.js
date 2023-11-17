const express=require("express");
//route imports
const products=require("./routes/productroute");
const users=require("./routes/userroute")
const orders=require("./routes/orderroute")
const cookieparser=require("cookie-parser")
const app=express();
const errormiddleware=require("./middleware/error")
app.use(express.json());
app.use(cookieparser())

const connecttodb=require("./config/database");
connecttodb();



app.use("/api/v1",products);
app.use("/api/v1",users);
app.use("/api/v1/",orders);


//middleware for errors
app.use(errormiddleware)

module.exports=app;