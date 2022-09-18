const createError = require("http-errors");
const mongoose = require("mongoose");

const Plan = require('../membership/plan');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    createPlan: async (req, res, next) => {
        try {
            
            const { name, price, duration } = req.body;

            // Check name is not empty
            if (!name) {
                return next(createError(400, "Name is required"));
            }

            // check price is a number and not empty
            if (!price || isNaN(price)) {
                return next(createError(400, "Price is required"));
            }

            // check duration is a number and not empty
            if (!price || isNaN(duration)) {
                return next(createError(400, "Duration must be a number"));
            }

            // check if plan already exists
            const checkedPlan = await Plan.findOne({ name });
            if (checkedPlan) {
                return next(createError(400, "Plan already exists"));
            }

            const plan = new Plan({
                name,
                price,
                duration,
            });

            await plan.save();

            return res.status(200).json({
                status: "success",
                message: "Plan created successfully",
                data: plan,
            });

        } catch (error) {
            next(error);
        }
    },

    getPlans: async (req, res, next) => {
        try {
            const plans = await Plan.find();
            return res.status(200).json({
                status: "success",
                message: "Plans fetched successfully",
                data: plans,
            });
        } catch (error) {
            next(error);
        }
    },

    updatePlan: async (req, res, next) => {
        try {
            const { id, name, price, duration } = req.body;

            // Check id is not empty
            if (!id) {
                return next(createError(400, "Id is required"));
            }

            // check id is valid mongo id
            if (!ObjectId.isValid(id)) {
                return next(createError(400, "Invalid id"));
            }

            // Check name is not empty
            if (!name) {
                return next(createError(400, "Name is required"));
            }

            // check price is a number and not empty
            if (!price || isNaN(price)) {
                return next(createError(400, "Price is required"));
            }

            // check duration is a number and not empty
            if (!price || isNaN(duration)) {
                return next(createError(400, "Duration must be a number"));
            }

            // check if plan already exists
            const checkedPlan = await Plan.findOne({ id });
            if (!checkedPlan) {
                return next(createError(400, "Plan does not exist"));
            }

            const plan = await Plan.findOneAndUpdate(
                { id },
                { name, price, duration },
                { new: true }
            );

            return res.status(200).json({
                status: "success",
                message: "Plan updated successfully",
                data: plan,
            });
        } catch (error) {
            next(error);
        }
    },

    deletePlan: async (req, res, next) => {
        try {
            const { id } = req.body;

            // Check id is not empty
            if (!id) {
                return next(createError(400, "Id is required"));
            }

            // check id is valid mongo id
            if (!ObjectId.isValid(id)) {
                return next(createError(400, "Invalid id"));
            }

            // check if plan already exists
            const checkedPlan = await Plan.findOne({ id });
            if (!checkedPlan) {
                return next(createError(400, "Plan does not exist"));
            }

            await Plan.findOneAndDelete({ id });

            return res.status(200).json({
                status: "success",
                message: "Plan deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
};