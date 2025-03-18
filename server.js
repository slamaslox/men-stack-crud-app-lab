// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config()

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

// Constants
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Import models
const Plant = require("./models/plant.js");

// Initialize Express app
const app = express();

// Database connection
mongoose.connect(MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log('Connected to MongoDB');
})

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Routes (I.N.D.U.C.E.S)

// ROOT - HOME
app.get('/', (req, res) => {
    res.render("home.ejs");
});

// INDEX
app.get('/plants', async (req, res) => {
 const allPlants = await Plant.find();
 console.log(allPlants);
 res.render("plants/index.ejs", {plants: allPlants});
});

// NEW
app.get('/plants/new', (req, res) => {
    res.render("plants/new.ejs");
});

// DELETE
app.delete('/plants/:plantId', async (req, res) => {
    // res.send("This is the delete route");
    await Plant.findByIdAndDelete(req.params.plantId);
    res.redirect("/plants");
});

// UPDATE
app.put('/plants/:plantId', async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }

    await Plant.findByIdAndUpdate(req.params.plantId, req.body)

    res.redirect(`/plants/${req.params.plantId}`)
})

// CREATE (LINKED WITH NEW)
app.post('/plants', async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Plant.create(req.body);
    console.log(req.body)
    res.redirect("/plants");
})

// EDIT (LINKED WITH UPDATE)
app.get("/plants/:plantId/edit", async (req, res) => {
    const foundPlant = await Plant.findById(req.params.plantId);
    res.render("plants/edit.ejs", {
        plant: foundPlant,
    });
});

// SHOW
app.get("/plants/:plantId", async (req, res) => {
    const foundPlant = await Plant.findById(req.params.plantId);
    res.render("plants/show.ejs", { plant: foundPlant });
  });

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});