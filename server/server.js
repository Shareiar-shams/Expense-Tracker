require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require("./middleware/auth");
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection (SERVERLESS SAFE)
========================= */
// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

/* =========================
   Routes
========================= */

// Health check
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

// Auth routes (PUBLIC)
app.use('/api/auth', authRoutes);

// Protected routes start here
app.use(authMiddleware);

// Category routes
app.use('/api/categories', categoryRoutes);

// Transaction routes
app.use('/api/transactions', transactionRoutes);

/* =========================
    Export app for Vercel
 ========================= */
module.exports = app;
