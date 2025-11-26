import { MongoClient } from "mongodb";


const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/backendproject01";

console.log("🔍 Debug - MONGODB_URI:", MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
    );
}

let client;
let database;

export async function db() {
    try {
        if (database) {
            return database;
        }

        console.log("🔗 Attempting to connect to MongoDB...");
        console.log("📝 Using URI:", MONGODB_URI);

        client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, 
        });

        await client.connect();

 
        await client.db().admin().ping();

        database = client.db();
        console.log("Successfully connected to MongoDB");
        return database;
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:");
        console.error("   Error:", error.message);

        if (error.message.includes("ECONNREFUSED")) {
            console.error("   💡 Make sure MongoDB is running on your system");
            console.error("   💡 Run: brew services start mongodb-community");
        }

        process.exit(1);
    }
}
