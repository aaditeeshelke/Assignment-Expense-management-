const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

// Static files
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register user
app.post("/signup", async (req, res) => {
    try {
        const existingUser = await collection.findOne({ name: req.body.username });
        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            name: req.body.username,
            password: hashedPassword
        };
        await collection.insertMany(userData);
        res.send("User registered successfully!");
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("An error occurred while registering user.");
    }
});

// User login
app.post("/login", async (req, res) => {
    try {
        const username = req.body.username.trim(); // Trim whitespace
        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.send("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            console.log("Login successful for user:", username);
            res.redirect("/app"); // Redirect to the route that renders App.jsx
        } else {
            console.log("Incorrect password for user:", username);
            res.send("Incorrect password");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred while logging in");
    }
});

// Route to render App.ejs
app.get("/app", (req, res) => {
    res.render("App");
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
