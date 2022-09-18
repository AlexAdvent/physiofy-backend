const createError = require("http-errors");
const mongoose = require("mongoose");

const Plan = require('../membership/plan');
const UserPlan = require('../membership/user-plan');
const Physio = require('../user-management/physio');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addUsersToPlan: async (req, res, next) => {
        try {
            let { physioId, planId, } = req.body;

            // Check physioId is not empty and is a valid ObjectId
            if (!physioId || !ObjectId.isValid(physioId)) {
                return next(createError(400, "Valid PhysioId is required"));
            }

            // Check planId is not empty and is a valid ObjectId
            if (!planId || !ObjectId.isValid(planId)) {
                return next(createError(400, "Valid PlanId is required"));
            }

            // Check if physio exists
            const physio = await Physio.findById(physioId);
            if (!physio) {
                return next(createError(400, "Physio does not exist"));
            }

            // Check if plan exists
            const plan = await Plan.findById(planId);
            if (!plan) {
                return next(createError(400, "Plan does not exist"));
            }

            // Check if physio already has a active plan ending after today
            const activePlan = await UserPlan.findOne({
                physioId,
                active: true,
                endDate: { $gt: new Date() }
            });

            if (activePlan) {
                return next(createError(400, "Physio already has an active plan"));
            }

            // Create user plan
            const newUserPlan = new UserPlan({
                physioId,
                planId,
                startDate: new Date(),
                endDate: new Date().setDate(new Date().getDate() + plan.duration),
                price: plan.price,
            });

            await newUserPlan.save();

            return res.status(200).json({
                status: "success",
                message: "User added to plan successfully",
            });

        } catch (error) {
            next(error);
        }
    },

    getPhysioPlans: async (req, res, next) => {
        try {
            const { physioId } = req.params;

            // Check physioId is not empty and is a valid ObjectId
            if (!physioId || !ObjectId.isValid(physioId)) {
                return next(createError(400, "Valid PhysioId is required"));
            }

            // Check if physio exists
            const physio = await Physio.findById(physioId);
            if (!physio) {
                return next(createError(400, "Physio does not exist"));
            }

            const userPlans = await UserPlan.find({ physioId });

            return res.status(200).json({
                status: "success",
                data: userPlans,
            });

        } catch (error) {
            next(error);
        }
    }
};

