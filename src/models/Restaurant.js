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
    menuItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
        },
    ],
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;
