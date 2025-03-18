// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config()

// Import dependencies
const mongoose = require('mongoose');

// Constants
const MONGODB_URI = process.env.MONGODB_URI;

// Import models
const Plant = require("./models/plant.js");

// Database connection
mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log('Connected to MongoDB');
})

const seedPlants = [
    { name: "Monstera Deliciosa", species: "Monstera", wateringSchedule: "Weekly", lightRequirements: "Partial sun" },
    { name: "Snake Plant", species: "Sansevieria", wateringSchedule: "Biweekly", lightRequirements: "Shade" },
    { name: "Aloe Vera", species: "Aloe", wateringSchedule: "Every 2 days", lightRequirements: "Full sun" },
    { name: "Fiddle Leaf Fig", species: "Ficus lyrata", wateringSchedule: "Weekly", lightRequirements: "Full sun" },
    { name: "Peace Lily", species: "Spathiphyllum", wateringSchedule: "Weekly", lightRequirements: "Partial sun" }
];

const seedDB = async () => {
    await Plant.deleteMany({}); // Clear database first
    await Plant.insertMany(seedPlants);
    console.log("Database seeded!");
    mongoose.connection.close();
};

seedDB();
