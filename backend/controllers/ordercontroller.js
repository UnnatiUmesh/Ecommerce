const Order = require("../models/ordermodel")
const Product = require("../models/productmodel")
const errorhandler = require("../utils/errorhandling")
const catchasyncerror = require("../middleware/catchasyncerror")
const apifeatures = require("../utils/apifeatures")
const User = require("../models/usermodel")


//create a new order
exports.neworder = catchasyncerror(async (req, res, next) => {

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  })
  res.status(201).json({
    success: true,
    order
  })

})


//get single order-->admin
exports.getSingleOrder = catchasyncerror(async (req, res, next) => {

  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order)
    return next(new errorhandler("Order not found with this id", 404));

  res.status(201).json({
    success: true,
    order
  })
})

//get logged in user order
exports.myOrders = catchasyncerror(async (req, res, next) => {

  const order = await Order.find({ user: req.user._id })

  res.status(201).json({
    success: true,
    order
  })
})


//get all order-->admin
exports.getAllOrder = catchasyncerror(async (req, res, next) => {

  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  })

  res.status(201).json({
    success: true,
    orders
  })
})


//update order status-->admin
exports.updateOrder = catchasyncerror(async (req, res, next) => {

  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new errorhandler("Order not found with this id", 404));
  }

  if (order.orderStatus === "Delivered")
    return next(new errorhandler("You have already delivered this order ", 404))

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity)
  })

  order.orderStatus = req.body.status

  if (req.body.status === "Delivered")
    order.deliveredAt = Date.now();

  await order.save({
    validateBeforeSave: false
  })


  res.status(201).json({
    success: true,

  })
})


async function updateStock(id, quantity) {
  console.log("Illi bantu");
  const product = await Product.findById(id)

  product.stock -= quantity
  console.log(product.stock);
  await product.save({ validateBeforeSave: false })


}


//delete order --admin

exports.deleteOrder = catchasyncerror(async (req, res, next) => {

  const orders = await Order.findById(req.params.id);
  if (!orders)
    return next(new errorhandler("Order not found with this id", 404));

  await orders.deleteOne()

  res.status(201).json({
    success: true,
    orders
  })
})

