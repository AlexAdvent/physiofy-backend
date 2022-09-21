const createError = require("http-errors");
const mongoose = require("mongoose");

const Category = require('./category');

module.exports = {
    addCategory: async (req, res, next) => {
        try {
            const { 
                name,
                description,
                sortNumber,
            } = req.body;

            //  check name is not empty
            if (!name) {
                return next(createError(400, "Name is required"));
            }

            //  check sortNumber is not empty and integer
            if (!sortNumber || !Number.isInteger(sortNumber)) {
                return next(createError(400, "Sort number is required and should be an integer"));
            }

            // create category
            const newCategory = new Category({
                name,
                description,
                sortNumber,
            });

            await newCategory.save();

            return res.status(200).json({
                status: "success",
                message: "Category added successfully",
            });

        }
        catch (error) {
            next(error);
        }
    },
    getCategories: async (req, res, next) => {
        try {
            const categories = await Category.find({});

            return res.status(200).json({
                status: "success",
                message: "Categories fetched successfully",
                data: {
                    categories
                }
            });

        }
        catch (error) {
            next(error);
        }
    },

    getCategory: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(createError(400, "Invalid category id"));
            }

            const category = await Category.findById(id);

            if (!category) {
                return next(createError(404, "Category not found"));
            }

            return res.status(200).json({
                status: "success",
                message: "Category fetched successfully",
                data: {
                    category
                }
            });

        }
        catch (error) {
            next(error);
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, description, sortNumber } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(createError(400, "Invalid category id"));
            }

            const category = await Category.findById(id);

            if (!category) {
                return next(createError(404, "Category not found"));
            }

            if (name) {
                category.name = name;
            }

            if (description) {
                category.description = description;
            }

            if (sortNumber) {
                category.sortNumber = sortNumber;
            }

            await category.save();

            return res.status(200).json({
                status: "success",
                message: "Category updated successfully",
            });

        }
        catch (error) {
            next(error);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(createError(400, "Invalid category id"));
            }

            const category = await Category.findById(id);

            if (!category) {
                return next(createError(404, "Category not found"));
            }

            await category.remove();

            return res.status(200).json({
                status: "success",
                message: "Category deleted successfully",
            });

        }
        catch (error) {
            next(error);
        }
    }
};

