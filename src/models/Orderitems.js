import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
 menuItem:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
 }
});

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
export default OrderItem;