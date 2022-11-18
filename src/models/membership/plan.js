var mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    duration: {
        type: Number, 
        required: true,
    },
    price: {
        type: Number,
    },
    type: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true
});

const Plan = mongoose.model('Plan', planSchema)
module.exports = Plan;
