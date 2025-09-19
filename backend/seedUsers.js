// seedUsers.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const sampleUsers = [
    {
        name: "Sarah Johnson",
        email: "sarah@gmail.com",
        password: "test123",
        role: "staff",
        exp: "12 years experience",
        skills: ["Balayage", "Cuts", "Styling"],
        position: "Senior Hair Stylist",
        phone: "1234567890",
        avatarUrl:
            "https://readdy.ai/api/search-image?query=Professional%20female%20hair%20stylist%20in%20elegant%20salon%2C%20confident%20smile%2C%20professional%20attire%2C%20modern%20salon%20background%2C%20expert%20hairstylist%20portrait%2C%20beauty%20professional&width=300&height=400&seq=stylist-1&orientation=portrait",
    },
    {
        name: "Maria Rodriguez",
        email: "maria@gmail.com",
        password: "test123",
        role: "staff",
        exp: "10 years experience",
        skills: ["Hair Color", "Highlights", "Ombre"],
        position: "Color Specialist",
        phone: "1234567890",
        avatarUrl:
            "https://readdy.ai/api/search-image?query=Professional%20female%20hair%20colorist%20in%20modern%20salon%2C%20holding%20hair%20color%20tools%2C%20expert%20beauty%20professional%2C%20salon%20interior%20background%2C%20confident%20stylist%20portrait&width=300&height=400&seq=stylist-2&orientation=portrait",
    },
    {
        name: "Emma Chen",
        email: "emma@gmail.com",
        password: "test123",
        role: "staff",
        exp: "8 years experience",
        skills: ["Facials", "Skincare", "Massage"],
        position: "Spa Therapist",
        phone: "1234567890",
        avatarUrl:
            "https://readdy.ai/api/search-image?query=Professional%20spa%20therapist%20in%20clean%20white%20spa%20uniform%2C%20gentle%20smile%2C%20spa%20treatment%20room%20background%2C%20skincare%20specialist%2C%20wellness%20professional%20portrait&width=300&height=400&seq=therapist-1&orientation=portrait",
    },
    {
        name: "Jessica Williams",
        email: "jessica@gmail.com",
        password: "test123",
        role: "staff",
        exp: "6 years experience",
        skills: ["Manicures", "Pedicures", "Nail Art"],
        position: "Nail Technician",
        phone: "1234567890",
        avatarUrl:
            "https://readdy.ai/api/search-image?query=Professional%20nail%20technician%20at%20work%20station%2C%20nail%20art%20tools%20and%20colorful%20polishes%2C%20modern%20nail%20salon%2C%20expert%20manicurist%20portrait%2C%20beauty%20professional&width=300&height=400&seq=nail-tech&orientation=portrait",
    },
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/salon");
        console.log("Connected to MongoDB");

        for (let userData of sampleUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(userData.password, salt);

                const user = new User({
                    ...userData,
                    password: hashedPassword,
                });

                await user.save();
                console.log(`Created user: ${user.name} (${user.email})`);
            } else {
                console.log(`Skipped existing user: ${existingUser.email}`);
            }
        }

        console.log("User seeding completed ✅");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
