import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
     User:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderItem",
    required: true,
  }],
  restaurant: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },    
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
     }
});


const Order=mongoose.model("Order", OrderSchema);
export default Order;
