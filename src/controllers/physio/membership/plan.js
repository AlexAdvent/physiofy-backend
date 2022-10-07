const createError = require("http-errors");
const mongoose = require("mongoose");

const Plan = require('../../../models/membership/plan');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    createPlan: async (req, res, next) => {
        try {
            
            const { name, price, duration } = req.body;

            // Check name is not empty
            if (!name) {
                return res.status(400).send({ error: "Name is required", field: "name" });
            }

            // check price is a number and not empty
            if (!price || isNaN(price)) {
                return res.status(400).send({ error: "Integer Price is required", field: "price" });
            }

            // check duration is a number and not empty
            if (!price || isNaN(duration)) {
                return res.status(400).send({ error: "Integer Duration is required", field: "duration" });
            }

            // check if plan already exists
            const checkedPlan = await Plan.findOne({ name });
            if (checkedPlan) {
                return res.status(400).send({ error: "Plan name already exists", field: "name" });
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
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },

    getPlan: async (req, res, next) => {
        try {
            const plans = await Plan.find();
            return res.status(200).json({
                status: "success",
                message: "Plans fetched successfully",
                data: plans,
            });
        } catch (error) {
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },

    updatePlan: async (req, res, next) => {
        try {
            const { id, name, price, duration } = req.body;

            // Check id is not empty
            if (!id) {
                // return next(createError(400, "Id is required"));
                return res.status(400).send({ error: "Id is required", field: "id" });
            }

            // check id is valid mongo id
            if (!ObjectId.isValid(id)) {
                // return next(createError(400, "Invalid id"));
                return res.status(400).send({ error: "Invalid id", field: "id" });
            }

            // check if plan exists
            const plan = await Plan.findById(id);
            if (!plan) {
                return res.status(400).send({ error: "Plan does not exist", field: "id" });
            }

            // if price then check is a number
            if (price && isNaN(price)) {
                return res.status(400).send({ error: "Integer Price is required", field: "price" });
            }

            // check duration is a number
            if (duration && isNaN(duration)) {
                return res.status(400).send({ error: "Integer Duration is required", field: "duration" });
            }

            // update plan with new values if provided
            if (name) plan.name = name;
            if (price) plan.price = price;
            if (duration) plan.duration = duration;

            await plan.save();

            return res.status(200).json({
                status: "success",
                message: "Plan updated successfully",
                data: plan,
            });
        } catch (error) {
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },

    deletePlan: async (req, res, next) => {
        try {
            const { id } = req.body;

            // Check id is not empty
            if (!id) {
                return res.status(400).send({ error: "Id is required", field: "id" });
            }

            // check id is valid mongo id
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ error: "Invalid id", field: "id" });
            }

            // check if plan already exists
            const checkedPlan = await Plan.findOne({ id });
            if (!checkedPlan) {
                return res.status(400).send({ error: "Plan does not exist", field: "id" });
            }

            await Plan.findOneAndDelete({ id });

            return res.status(200).json({
                status: "success",
                message: "Plan deleted successfully",
            });
        } catch (error) {
            return next({ message: "internal server error", status: 500 });
        }
    }
};