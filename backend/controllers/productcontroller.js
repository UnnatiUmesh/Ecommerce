const product=require("../models/productmodel")
const errorhandler=require("../utils/errorhandling")
const catchasyncerror=require("../middleware/catchasyncerror")
const apifeatures=require("../utils/apifeatures")

//create a product
exports.createproduct=catchasyncerror(async(req,res,next)=>{

 req.body.user=req.user.id;   
const cp =await product.create(req.body);

res.status(201).json({
    success:true,
    cp
})
}
)
//get all products

exports.getallproducts=catchasyncerror(async (req,res,next)=>{
const resultperpage=5;
const productcount=await product.countDocuments();

const apf=new apifeatures(product.find(),req.query)
.search()
.filter()
.pagination(resultperpage)


console.log(apf);

let products=await apf.query;
    console.log(products);
    
    res.status(200).json({
        success:true,
        products,
        productcount
    })

}
)
//update products
exports.updateproduct=catchasyncerror(async (req,res)=>{
    let p=await product.findById(req.params.id);
    if(!p)
    {
        return next(new errorhandler("product not found",404));
    }
    p=await product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    
    
    res.status(200).json({
        success:true,
        p
    })
}
)

//delete a product
exports.deleteproduct=catchasyncerror(async(req,res,next)=>{
    const cp=await product.findById(req.params.id);
    if(!cp)
    {
        return next(new errorhandler("product id not found",404));
    }

    await cp.deleteOne();
    res.status(200).json({
        success:"true",
        message:"product deleted successfully"
    })
}
)
//get product details
exports.getproductdetails=catchasyncerror(async(req,res,next)=>{
    const cp=await product.findById(req.params.id);
    if(!cp)
    {
        return next(new errorhandler("product id not found",404));
    }

    
    res.status(200).json({
        success:"true",
        cp,
       
    })
}
)

//create new review or update the review
exports.createproductreview=catchasyncerror(async(req,res,next)=>{
    const {rating,comment,productid}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const Product=await product.findById(productid);

    const isreviewed=Product.reviews.find(rev=> rev.user.toString()===req.user._id.toString());

    if(isreviewed)
    {
        Product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
              (rev.rating=rating),
              (rev.comment=comment)
        })
    }
    else
    {
        Product.reviews.push(review)
        Product.numberofreviews=Product.reviews.length;
    }

    let avg=0;
    Product.reviews.forEach(rev=>{
        avg+=rev.rating;
    })
    
    Product.ratings=avg/Product.reviews.length;

    await Product.save({
        validateBeforeSave:false
    })

    res.status(200).json({
        success:true,
    })
}
)

//Get all reviews of a product



exports.getproductreviews=catchasyncerror(async(req,res,next)=>{
   
    const Product=await product.findById(req.query.id)
    

    if(!Product)
    return next(new errorhandler("product id not found",404));

    res.status(200).json({
        success:true,
        reviews:Product.reviews
    })
}
)

//Delete reviews

exports.deletereviews=catchasyncerror(async(req,res,next)=>{
   
    const Product=await product.findById(req.query.productid)
    

    if(!Product)
    return next(new errorhandler("product id not found",404));

    const reviews=Product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());

    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating;
    })
    
    const ratings=avg/reviews.length;
    const numberofreviews=reviews.length;

    await product.findByIdAndUpdate(req.query.productid,{
        reviews,ratings,numberofreviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
       
    })
}
)





