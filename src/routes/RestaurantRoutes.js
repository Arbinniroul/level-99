import express from "express";
import { getAllRestaurants } from "../controller/RestaurantController.js";
const router = express.Router();

router.get("/", getAllRestaurants);

export default router;
