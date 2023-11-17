const mongoose=require("mongoose");

const connecttodb=()=>{
mongoose.connect("mongodb+srv://dataset1:LuUdywnWHzjDZaAz@cluster0.eci328r.mongodb.net/ecommerce?retryWrites=true&w=majority")
.then((data)=>{
  console.log(`Mongodb connected with ${data.connection.host}`)
})
}



module.exports=connecttodb