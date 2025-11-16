const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// Get all categories for the authenticated user
router.get("/", getAllCategories);

// Create a new category
router.post("/", createCategory);

// Get a single category by ID
router.get("/:id", getCategoryById);

// Update a category
router.put("/:id", updateCategory);

// Delete a category
router.delete("/:id", deleteCategory);

module.exports = router;
