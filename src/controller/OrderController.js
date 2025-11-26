import MenuItem from "../models/MenuItem";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";


export const createOrder=async(req,res)=>{
    try{
        const {userId, orderItems, restaurantId}=req.body;


        let orderItemIds=[];
        let totalPrice=0;

        for(const item of orderItems){

            const menu=await MenuItem.findById(item.menuItem);
            if(!menu){
                return res.status(404).json({message:`Menu item with id ${item.menuItem} not found`});
            }
            const orderItem=await OrderItem.create({
                menuItem:item.menuItem,
                quantity:item.quantity,
            });
            orderItemIds.push(orderItem._id);
            totalPrice += menu.price * item.quantity;
        }
        
        const order = new Order({
            User: userId,
            orderItems: orderItemIds,
            restaurant: restaurantId,
            totalPrice: totalPrice,
        });

        
        await order.save();
        res.status(201).json({ message: "Order created successfully", order });
    }catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}