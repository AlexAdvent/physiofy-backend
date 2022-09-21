const createError = require("http-errors");
const mongoose = require("mongoose");

const exercise = require('./exercise');
const Category = require('./category');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addExercise: async (req, res, next) => {
        try {
            const { 
                name, 
                description,
                ParentCategoryId,
                gif,
                sortNumber,
            } = req.body;

            //  check name is not empty
            if (!name) {
                return next(createError(400, "Name is required"));
            }

            //  check ParentCategoryId is not empty and mongoId
            if (!ParentCategoryId || !ObjectId.isValid(ParentCategoryId)) {
                return next(createError(400, "ParentCategoryId is required and should be a mongoId"));
            }

            //  if sortnumber then check it is integer
            if (sortNumber && !Number.isInteger(sortNumber)) {
                return next(createError(400, "Sort number should be an integer"));
            }

            // check if parent category exists
            const parentCategory = await Category.findById(ParentCategoryId);
            if (!parentCategory) {
                return next(createError(400, "Parent category does not exist"));
            }

            // create exercise
            const newExercise = new exercise({
                name,
                description,
                ParentCategoryId,
                gif,
                sortNumber,
            });

            await newExercise.save();

            return res.status(200).json({
                status: "success",
                message: "Exercise added successfully",
            });

        }
        catch (error) {
            next(error);
        }
    }
}