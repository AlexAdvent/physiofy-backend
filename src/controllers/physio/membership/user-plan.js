const createError = require("http-errors");
const mongoose = require("mongoose");

const Plan = require('../../../models/membership/plan');
const UserPlan = require('../../../models/membership/user-plan');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addPhysioToPlan: async (req, res, next) => {
        try {
            let { planId, } = req.body;

            let id = req.physio._id;

            // Check planId is not empty and is a valid ObjectId
            if (!planId || !ObjectId.isValid(planId)) {
                return res.status(400).send({ error: "Valid PlanId is required", field: "planId" });
            }

            // Check if plan exists
            const plan = await Plan.findById(planId);
            if (!plan) {
                // return next(createError(400, "Plan does not exist"));
                return res.status(400).send({ error: "Plan does not exist", field: "planId" });
            }

            // Check if physio already has a active plan ending after today
            const activePlan = await UserPlan.findOne({
                physioId: id,
                active: true,
                endDate: { $gt: new Date() }
            });

            if (activePlan) {
                return res.status(400).send({ error: "Physio already has an active plan", field: "planId" });
            }

            // Create user plan
            const newUserPlan = new UserPlan({
                physioId: id,
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
            // next(error);
            console.log("error", error);
            return next({ message: "internal server error", status: 500 });
        }
    },

    getPhysioPlan: async (req, res, next) => {
        try {

            let id = req.physio._id;

            // find active plan ending after today
            const activePlan = await UserPlan.findOne({
                physioId: id,
                active: true,
                endDate: { $gte: new Date() }
            });

            return res.status(200).json({
                status: "success",
                data: activePlan,
            });

        } catch (error) {
            next(error);
        }
    }
};

