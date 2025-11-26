import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  menuItem:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  }
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;