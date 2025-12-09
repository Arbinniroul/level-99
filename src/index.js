import "dotenv/config";
import express from "express";
import restaurantRoutes from "../src/routes/RestaurantRoutes.js";
import menuRoutes from "../src/routes/MenuRoutes.js";
import { db } from "./db/connections.js";

const PORT = 8000;
 await db();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api", menuRoutes);
app.listen(PORT, () => {
    console.log(`Backend server connected in ${PORT}`);
});
