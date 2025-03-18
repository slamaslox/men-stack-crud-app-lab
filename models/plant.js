const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true },
    species: {
        type: String,
    },
    wateringSchedule: { 
        type: String, 
        enum: ["Daily", "Every 2 days", "Weekly", "Biweekly", "Monthly"], 
        required: true 
    },
    lightRequirements: { 
        type: String, 
        enum: ["Full sun", "Partial sun", "Shade"], 
        required: true 
    },
});

module.exports = mongoose.model("Plant", plantSchema);