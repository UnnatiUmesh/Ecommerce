const mongoose=require("mongoose")
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter the product name"]
    },
    description:{
        type:String,
        required:[true,"Please Enter the product description"]
    },
    price:{
    type:Number,
        required:[true,"Please Enter the product price"],
        maxLength:[8,"Price cannot be more than 8"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:
    [{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"Please enter the product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter the product stock"],
        maxLength:[4,"Stock cannot exceed 4 characters"],
        default:1
    },
    numberofreviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
    }],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
        
    }

)

module.exports=mongoose.model("product",productSchema)