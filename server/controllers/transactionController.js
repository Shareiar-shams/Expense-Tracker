const Transaction = require('../models/Transactions');

// Get all transactions for the authenticated user
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1});
        res.status(200).json({
            message: "Transactions fetched successfully",
            transactions
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { amount, type, categoryId, date, notes } = req.body;
        // Basic validation
        if (!amount || !type || !categoryId || !date) {
            return res.status(400).json({ message: "Amount, type, categoryId, and date are required" });
        }
        const newTransaction = new Transaction({
            userId: req.user.id,
            amount,
            type,
            category: categoryId,
            date,
            description: notes
        });
        const savedTransaction = await newTransaction.save();
        res.status(201).json({
            message: "Transaction created successfully",
            transaction: savedTransaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({
            message: "Single Transaction fetched successfully",
            transaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const { amount, type, categoryId, date, notes } = req.body;
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { amount, type, category: categoryId, date, description: notes },
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({
            message: "Transaction updated successfully",
            transaction: updatedTransaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({
            message: "Transaction deleted successfully",
            deletedTransaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

module.exports = {
    getAllTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};