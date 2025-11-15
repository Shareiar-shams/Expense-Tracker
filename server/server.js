require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// Sample route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
}); 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
