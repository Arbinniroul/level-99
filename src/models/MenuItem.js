import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);
export default MenuItem;