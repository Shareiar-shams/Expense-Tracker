const Category = require('../models/Categories');

// Get all categories for the authenticated user
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.id }).sort({ createdAt: -1});

        res.status(200).json({
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error
        });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    try {
        let { name, type, icon, color } = req.body;

        // Basic validation
        if (!name || !type) {
            return res.status(400).json({ message: "Name and type are required" });
        }
        type = type.toLowerCase();
        console.log("Creating category with type:", type);
        // type validation
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Type must be income or expense" });
        }

        // Unique validation already handled by Mongo index (userId + name)
         
        const category = new Category({
            userId: req.user.id,
            name,
            type,
            icon: icon || "",
            color: color || "#000000"
        });

        await category.save();

        res.status(201).json({
            message: "Category created successfully",
            category
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category with this name already exists!" });
        }
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            message: "Single Category fetched successfully",
            category
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    try {
        let { name, type, icon, color } = req.body;

        type = type.toLowerCase();
        // type validation
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({ message: "Type must be income or expense" });
        }

        // Check if name already exists for this user excluding current category
        if (name) {
            const existing = await Category.findOne({
                _id: { $ne: req.params.id }, // exclude current category
                userId: req.user.id,
                name: name
            });

            if (existing) {
                return res.status(400).json({ message: "Category with this name already exists!" });
            }
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, type, icon, color },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found or unauthorized" });
        }

        res.status(200).json({
            message: "Category updated successfully",
            updatedCategory
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deleted) {
            return res.status(404).json({ message: "Category not found or unauthorized" });
        }

        res.status(200).json({
            message: "Category deleted successfully",
            category: deleted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};