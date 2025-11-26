import dotenv from "dotenv";
import mongoose from "mongoose";
import MenuItem from "./src/models/MenuItem.js";
import Restaurant from "./src/models/Restaurant.js";

dotenv.config();
const seed = async () => {
    try {
        await mongoose.connect(
            process.env.MONGOURI || "mongodb://localhost:27017/myprojectdb"
        );
        console.log("MongoDB connected ✔");
        await Restaurant.deleteMany({});
        await MenuItem.deleteMany({});

        const restaurant = await Restaurant.insertMany([
            {
                name: "The Gourmet Kitchen",
                address: "123 Foodie Lane, Flavor Town",
                menuItem: new mongoose.Types.ObjectId(),
            },
            {
                name: "Pasta Palace",
                address: "456 Noodle St, Carb City",
                menuItem: new mongoose.Types.ObjectId(),
            },
            {
                name: "Sushi Central",
                address: "789 Sashimi Ave, Oceanview",
                menuItem: new mongoose.Types.ObjectId(),
            },
        ]);
        const menuItems = await MenuItem.insertMany([
            {
                name: "Grilled Salmon",
                description:
                    "Fresh salmon grilled to perfection with a side of vegetables.",
                price: 25.99,
                restaurant: restaurant[0]._id,
            },
            {
                name: "Spaghetti Carbonara",
                description:
                    "Classic Italian pasta with creamy sauce, pancetta, and Parmesan cheese.",
                price: 18.5,
                restaurant: restaurant[1]._id,
            },
            {
                name: "California Roll",
                description: " Sushi roll with crab, avocado, and cucumber.",
                price: 19,
                restaurant: restaurant[2]._id,
            },
        ]);

        await Restaurant.findByIdAndUpdate(restaurant[0]._id, {
            menuItem: menuItems[0]._id,
        });
        await Restaurant.findByIdAndUpdate(restaurant[1]._id, {
            menuItem: menuItems[1]._id,
        });
        await Restaurant.findByIdAndUpdate(restaurant[2]._id, {
            menuItem: menuItems[2]._id,
        });

        console.log("Linked restaurants with menu items ✔");
        console.log("SEED COMPLETED 🎉");

        process.exit();
    } catch (error) {
        console.error("SEED ERROR ❌", error);
        process.exit(1);
    }
};
seed();
