
import express from "express"
import { createBulkMenu, createMenu, getMenuItemsByRestaurantid } from "../controller/MenuController.js";
const router=express.Router();


router.get("/get/:id",getMenuItemsByRestaurantid)
router.post("/createMenu", createMenu)
router.post("/createBulkMenu", createBulkMenu)


export default router;