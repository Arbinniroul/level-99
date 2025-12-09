import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

export const createMenu = async (req, res) => {
    try {
        const { name, description, price, restaurantId } = req.body;
        if(!name || !description||!price||!restaurantId){
           return res.json({message:"All fields must be filled"});
        }

      
            const existsorNot=await Restaurant.findById(restaurantId)
            

        if(!existsorNot){
            res.json({message:"Restaurant not found"})
        }
        const newMenuItem = new MenuItem({
            name,
            description,
            price:Number(price),
            restaurant: restaurantId,
        });
        const savedMenuItem = await newMenuItem.save();

        await Restaurant.findByIdAndUpdate(restaurantId, {
            $push: { menuItems: savedMenuItem._id },
        });

        res.status(201).json({message:"MenuItems created",savedMenuItem});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
export const getAllMenuItems=async(req,res)=>{
    try {
        const{restaurant,minPrice,maxPrice,search,page=1,limit=10,sortBy="createdAt",order="desc"}=req.body;
        const filter={};

        if(restaurant){
            filter.restaurant=restaurant;
        }

        if(maxPrice||minPrice){
            if(minPrice) filter.minPrice.$gte=Number(minPrice);
            if(maxPrice) filter.maxPrice.$lte=Number(maxPrice);
        }

        if(search){
            filter.$or=[
                {name:{$regex:search,$options:i}},
                {description:{$regex:search,$options:i}}
            ]
        }
        const skip=(Number(page)-1)*Number(limit)
        const sortOrder=order==="asc"?1:-1;
         const sort={[sortBy]:sortOrder}

         const menuItems=await MenuItem.find(filter)
         .populate("restaurants","name address")
         .sort(sort)
         .skip(skip)
         .limit(limit);
         const total = menuItems.countDocuments(filter);
         res.status(200).json({
             success: true,
             count: menuItems.length,
             total,
             page: Number(page),
             pages: Math.ceil(total / limit),
             data: menuItems,
         });
    } catch (error) {
             console.error("Get all menu items error:", error);
             res.status(500).json({
                 success: false,
                 message: "Server Error",
                 error: error.message,
             }); 
    }
}
export const getMenuItemsByRestaurantid = async (req, res) => {
    try {
        const { id } = req.body;
        const menuItems = await MenuItem.find({})
        .where({restaurant:id})
        console.log(menuItems);
    } catch (error) {
        res.json();
    }
};
export const createBulkMenu=async(req,res)=>{
try{
        const {menuItems}=req.body;
  if(!Array.isArray(menuItems)|| menuItems.length==0){
    return res.status(400).json({
        success:false,
        message:"menuItems must be a non-empty array"
    })

  
  }
    for (const item of menuItems) {
        if (
            !item.name ||
            !item.description ||
            !item.price ||
           !item.restaurantId
        ) {
            return res.status(400).json({
                message: "All field are required",
                invalidItem:item
            });
        }
            if (!mongoose.Types.ObjectId.isValid(item.restaurantId)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid restaurantId format: ${item.restaurantId}`,
                    invalidItem: item,
                });
            }
            const restaurantExists = await Restaurant.findById(
              item.restaurantId
            );
          
            if (!restaurantExists) {
                return res.status(404).json({
                    success: false,
                    message: `Restaurant not found: ${item.restaurantId}`,
                    invalidItem: item,
                });
            }
        
    }
       
    const itemsForInsert = menuItems.map((item) => ({
        name: item.name,
        description: item.description || "", 
        price: Number(item.price),
        restaurant: item.restaurantId,
    }));

    
    const createdItems = await MenuItem.insertMany(itemsForInsert);

    const restaurantUpdates = {};
    createdItems.forEach((item) => {
        const restaurantId = item.restaurant.toString();
         
        if (!restaurantUpdates[restaurantId]) {
            restaurantUpdates[restaurantId] = [];
        }
        restaurantUpdates[restaurantId].push(item._id);
    });
    console.log(restaurantUpdates);

    for(const [restaurantId,itemIds] of Object.entries(restaurantUpdates)){
        await Restaurant.findByIdAndUpdate(
            restaurantId,
            {$push:{menuItems:{$each:itemIds}},
            }
        )
    }
    res.status(201).json({
        success:true,
        message:`${createdItems.length} items created successfully`,
        data:createdItems
    })
}

catch(error){
console.log("Bulk menuItems creation error");
res.status(500).json({
    success:false,
    message:"server error",
    error:error.message
})
}
}