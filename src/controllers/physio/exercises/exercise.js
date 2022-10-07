const createError = require("http-errors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Exercise = require("../../../models/exercises/exercise");
const Category = require("../../../models/exercises/category");
const upload = require("../../../middleware/multer").single("exerciseGif");
const ObjectId = mongoose.Types.ObjectId;

let deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log("err", err);
        }
    });
};

module.exports = {
    addExercise: async (req, res, next) => {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log("A Multer error occurred when uploading.");
                console.log(err);
                return res
                    .status(400)
                    .send({ error: err.message, field: "exerciseGif" });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.log("A Multer error occurred when uploading.");
                console.log("err", err);
                return res
                    .status(400)
                    .send({ error: err.message, field: "exerciseGif" });
            }
            console.log("req.file", req.file);
            try {
                const { name, description, ParentCategoryId, sortNumber } = req.body;

                //  check name is not empty
                if (!name) {
                    // if file exist delete it
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res
                        .status(400)
                        .send({ error: "Name is required", field: "name" });
                }

                //  check ParentCategoryId is not empty and mongoId
                if (!ParentCategoryId || !ObjectId.isValid(ParentCategoryId)) {

                    if (req.file) {
                        deleteFile(req.file.path);
                    }

                    return res.status(400).send({
                        error: "ParentCategoryId is required and should be a mongoId",
                        field: "ParentCategoryId",
                    });
                }

                //  check sortNumber is not empty and integer
                if (!sortNumber || Number.isNaN(sortNumber)) {

                    if (req.file) {
                        deleteFile(req.file.path);
                    }

                    return res.status(400).send({
                        error: "Sort number is required and should be an integer",
                        field: "sortNumber",
                    });
                }

                // check if parent category exists
                const parentCategory = await Category.findById(ParentCategoryId);
                if (!parentCategory) {

                    if (req.file) {
                        deleteFile(req.file.path);
                    }

                    // return next(createError(400, "Parent category does not exist"));
                    return res.status(400).send({
                        error: "Parent category does not exist",
                        field: "ParentCategoryId",
                    });
                }

                // check if exercise with name already exist with parent category
                const checkedExercise = await Exercise.findOne({
                    name,
                    ParentCategoryId,
                });

                if (checkedExercise) {

                    if (req.file) {
                        deleteFile(req.file.path);
                    }

                    return res.status(400).send({
                        error: "Exercise name already exists with parent category",
                        field: "name",
                    });
                }

                // create exercise
                const newExercise = new Exercise({
                    name,
                    description,
                    ParentCategoryId,
                    gif: req.file ? req.file.path : null,
                    sortNumber,
                });

                await newExercise.save();

                return res.status(200).json({
                    status: "success",
                    message: "Exercise added successfully",
                });
            } catch (error) {
                console.log("error", error);
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    },
    getExercises: async (req, res, next) => {
        try {
            const exercises = await Exercise.find({});
            return res.status(200).json({
                status: "success",
                data: exercises,
            });
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    getExercise: async (req, res, next) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send({
                    error: "Invalid category id",
                    field: "id",
                });
            }

            const exercise = await Exercise.findById(id);

            return res.status(200).json({
                status: "success",
                data: exercise,
            });
        } catch (error) {
            console.log("error", error);
            return res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    },

    updateExercise: async (req, res, next) => {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                console.log("A Multer error occurred when uploading.");
                console.log(err);
                return res
                    .status(400)
                    .send({ error: err.message, field: "exerciseGif" });
            } else if (err) {
                // An unknown error occurred when uploading.
                console.log("A Multer error occurred when uploading.");
                console.log("err", err);
                return res
                    .status(400)
                    .send({ error: err.message, field: "exerciseGif" });
            }
            try {
                const { id } = req.query;
                const { name, description, ParentCategoryId, sortNumber } = req.body;

                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({
                        error: "Invalid category id",
                        field: "id",
                    });
                }

                // check if exercise exist
                const exercise = await Exercise.findById(id);
                if (!exercise) {
                    return res.status(400).json({
                        error: "Exercise does not exist",
                        field: "id",
                    });
                }

                if (name) {
                    // Todo: check if name already exist with parent category
                    exercise.name = name;
                }

                if (description) {
                    exercise.description = description;
                }

                if (ParentCategoryId) {
                    // check if parent category exists
                    const parentCategory = await Category.findById(ParentCategoryId);
                    if (!parentCategory) {
                        return res.status(400).json({
                            error: "Parent category does not exist",
                            field: "ParentCategoryId",
                        });
                    }
                    exercise.parentCategoryId = ParentCategoryId;
                }

                if (sortNumber) {
                    // check if sortNumber is integer
                    if (Number.isNaN(sortNumber)) {
                        return res.status(400).send({
                            error: "Sort number should be an integer",
                            field: "sortNumber",
                        });
                    }
                    exercise.sortNumber = sortNumber;
                }

                // update exercise gif
                if (req.file) {
                    // delete old gif
                    if (exercise.gif) {
                        deleteFile(exercise.gif);
                    }
                    exercise.gif = req.file.path;
                }

                await exercise.save();

                return res.status(200).json({
                    status: "success",
                    message: "Exercise updated successfully",
                });

            } catch (error) {
                console.log("error", error);
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                });
            }
        });
    },

    deleteExercise: async (req, res, next) => {
        try {
            const { id } = req.query;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    error: "Invalid category id",
                    field: "id",
                });
            }

            let deletedExercise = await Exercise.findByIdAndDelete(id);

            // check if deleted
            if (!deletedExercise) {
                return res.status(400).json({
                    error: "Exercise does not exist",
                    field: "id",
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Exercise deleted successfully",
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
