var mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    physioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Physio",
        required: true,
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
    },
    active: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true
});

const Plan = mongoose.model('UserPlan', planSchema)
module.exports = Plan;