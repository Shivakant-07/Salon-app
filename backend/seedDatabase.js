import mongoose from "mongoose";
import Service from "./models/Service.js";
import sampleServices from "./seedServices.js";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/salon");
        console.log("Connected to MongoDB");

        // Clear existing services
        await Service.deleteMany({});
        console.log("Cleared existing services");

        // Insert sample services
        const createdServices = await Service.insertMany(sampleServices);
        console.log(`Created ${createdServices.length} services`);

        // Display created services
        createdServices.forEach(service => {
            console.log(`- ${service.title} (${service.category}) - ₹${service.price}`);
        });

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
