const createError = require("http-errors");
const mongoose = require("mongoose");

const exercise = require('./exercise');

module.exports = {
    addExercise: async (req, res, next) => {
        try {
            const { 
                name, 
                description,
                category,
                videoUrl,
                sortNumber,
            } = req.body;

            //  check name is not empty
            if (!name) {
                return next(createError(400, "Name is required"));
            }

            //  check description is not empty
            if (!description) {
                return next(createError(400, "Description is required"));
            }

            //  check category is not empty
            if (!category) {
                return next(createError(400, "Category is required"));
            }

            //  check videoUrl is not empty
            if (!videoUrl) {
                return next(createError(400, "Video url is required"));
            }

            //  check sortNumber is not empty and integer
            if (!sortNumber || !Number.isInteger(sortNumber)) {
                return next(createError(400, "Sort number is required and should be an integer"));
            }

            // create exercise
            const newExercise = new exercise({
                name,
                description,
                category,
                videoUrl,
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