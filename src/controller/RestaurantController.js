import Restaurant from "../models/Restaurant";

export const getAllRestaruants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}