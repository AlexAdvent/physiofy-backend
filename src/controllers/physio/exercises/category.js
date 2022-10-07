const createError = require("http-errors");
const mongoose = require("mongoose");

const Category = require("../../../models/exercises/category");


module.exports = {
    addCategory: async (req, res, next) => {
        try {
            const { name, description, sortNumber } = req.body;

            //  check name is not empty
            if (!name) {
                return res
                    .status(400)
                    .send({ error: "Name is required", field: "name" });
            }

            //  check sortNumber is not empty and integer
            if (!sortNumber || Number.isNaN(sortNumber)) {
                return res
                    .status(400)
                    .send({
                        error: "Sort number is required and should be an integer",
                        field: "sortNumber",
                    });
            }

            // check if category with name already exist
            const checkedCategory = await Category.findOne({ name });
            if (checkedCategory) {
                return res
                    .status(400)
                    .send({ error: "Category name already exists", field: "name" });
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
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },
    getCategories: async (req, res, next) => {
        try {
            const categories = await Category.find({});

            return res.status(200).json({
                status: "success",
                message: "Categories fetched successfully",
                data: {
                    categories,
                },
            });
        } catch (error) {         
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    getCategory: async (req, res, next) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res
                    .status(400)
                    .send({
                        error: "Invalid category id",
                        field: "id",
                    });
            }

            const category = await Category.findById(id);

            if (!category) {
                return res.status(404).json({
                    status: "error",
                    message: "Category not found",
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Category fetched successfully",
                data: category,
            });
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const { id } = req.query;
            const { name, description, sortNumber } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                // return next(createError(400, "Invalid category id"));
                return res
                    .status(400)
                    .json({
                        error: "Invalid category id",
                        field: "id",
                    });
            }

            const category = await Category.findById(id);

            if (!category) {
                return res
                    .status(404)
                    .json({
                        status: "error",
                        message: "Category not found",
                    });
            }

            if (name) {
                category.name = name;
            }

            if (description) {
                category.description = description;
            }

            if (sortNumber) {
                // check if sortNumber is integer
                if (Number.isNaN(sortNumber)) {
                    return res.status(400).json({
                        error: "Sort number should be an integer",
                        field: "sortNumber",
                    });
                }

                category.sortNumber = sortNumber;
            }

            await category.save();

            return res.status(200).json({
                status: "success",
                message: "Category updated successfully",
            });
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res
                    .status(400)
                    .json({
                        error: "Invalid category id",
                        field: "id",
                    });
            }

            const category = await Category.findById(id);

            if (!category) {
                return res
                    .status(404)
                    .json({
                        status: "error",
                        message: "Category not found",
                    });
            }

            // TODO: check if category is used in any exercise

            await category.remove();

            return res.status(200).json({
                status: "success",
                message: "Category deleted successfully",
            });
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },
};
