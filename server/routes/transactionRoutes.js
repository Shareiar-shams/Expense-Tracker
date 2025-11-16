const express = require('express');
const router = express.Router();
const {
    getAllTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} = require('../controllers/transactionController');

// Get all transactions for the authenticated user
router.get("/", getAllTransactions);

// Create a new transaction
router.post("/", createTransaction);

// Get a single transaction by ID
router.get("/:id", getTransactionById);

// Update a transaction
router.put("/:id", updateTransaction);

// Delete a transaction
router.delete("/:id", deleteTransaction);

module.exports = router;