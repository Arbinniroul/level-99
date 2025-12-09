import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";

export const createRestaurant = async (req, res) => {
    try {
        const { name, address } = req.body;
 
        const newRestaurant = new Restaurant({
            name,
            address,
        });
        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
export const getAllRestaurants = async (req, res) => {
    try {
    
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                message: "Database not connected",
                state: mongoose.connection.readyState,
            });
        }

        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};