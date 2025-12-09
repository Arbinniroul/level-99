import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/myprojectdb";

export async function db() {
    try {
        
        if (mongoose.connection.readyState === 1) {
            console.log("✅ Already connected to MongoDB");
            return mongoose.connection;
        }

        console.log("🔗 Attempting to connect to MongoDB...");
        console.log("📝 Using URI:", MONGODB_URI);

        // Connect using Mongoose
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
            socketTimeoutMS: 45000,
        });

        console.log("✅ Successfully connected to MongoDB via Mongoose");

        // Test connection
        await mongoose.connection.db.admin().ping();
        console.log("✅ Database ping successful");

        return mongoose.connection;
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:");
        console.error("   Error:", error.message);

        if (
            error.message.includes("ECONNREFUSED") ||
            error.message.includes("ENOTFOUND")
        ) {
            console.error("   💡 Make sure MongoDB is running on your system");
            console.error(
                "   💡 For Mac: brew services start mongodb-community"
            );
            console.error("   💡 For Ubuntu: sudo systemctl start mongod");
            console.error("   💡 For Windows: Run MongoDB as a service");
            console.error("\n   📍 Try connecting manually: mongosh");
        }

        if (error.message.includes("authentication")) {
            console.error("   🔑 Check your MongoDB credentials in .env file");
        }

        process.exit(1);
    }
}
