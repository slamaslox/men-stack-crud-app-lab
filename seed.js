// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config()

// Import dependencies
const mongoose = require('mongoose');
const axios = require('axios');

// Constants
const MONGODB_URI = process.env.MONGODB_URI;
const TREFLE_API_KEY = process.env.TREFLE_API_KEY;

// Import models
const Plant = require("./models/plant.js");

// Database connection
mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log('Connected to MongoDB');
})

const fetchPlants = async () => {
    try {
        const randomPage = Math.floor(Math.random() * 10) + 1; // Get a random page (1-10)
        const TREFLE_API_URL = `https://trefle.io/api/v1/plants?token=${TREFLE_API_KEY}&page=${randomPage}`;

        console.log(`Fetching from page ${randomPage}`);

        const response = await axios.get(TREFLE_API_URL);
        const data = response.data;

        return data.data.slice(0, 5).map(plant => ({
            name: plant.common_name || "Unknown",
            species: plant.scientific_name || "Unknown",
            wateringSchedule: ["Daily", "Every 2 days", "Weekly", "Biweekly", "Monthly"][Math.floor(Math.random() * 5)],
            lightRequirements: ["Full sun", "Partial sun", "Shade"][Math.floor(Math.random() * 3)]
        }));
    } catch (err) {
        console.error("Error fetching plant data:", err);
        return [];
    }
};

// const seedPlants = [
//     { name: "Monstera Deliciosa", species: "Monstera", wateringSchedule: "Weekly", lightRequirements: "Partial sun" },
//     { name: "Snake Plant", species: "Sansevieria", wateringSchedule: "Biweekly", lightRequirements: "Shade" },
//     { name: "Aloe Vera", species: "Aloe", wateringSchedule: "Every 2 days", lightRequirements: "Full sun" },
//     { name: "Fiddle Leaf Fig", species: "Ficus lyrata", wateringSchedule: "Weekly", lightRequirements: "Full sun" },
//     { name: "Peace Lily", species: "Spathiphyllum", wateringSchedule: "Weekly", lightRequirements: "Partial sun" }
// ];

const seedDB = async () => {
    await Plant.deleteMany({}); // Clear database first
    
    const plants = await fetchPlants();
    await Plant.insertMany(plants);
    
    console.log("Database seeded!");
    mongoose.connection.close();
};

seedDB();
