import "dotenv/config";
import express from "express";
import { restaurantRoutes } from "../src/routes/RestaurantRoutes.js";
import { db } from "./db/connections.js";

const PORT = 8000;
await db();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", restaurantRoutes);
app.use("/api", restaurantRoutes);
app.listen(PORT, () => {
    console.log(`Backend server connected in ${PORT}`);
});
