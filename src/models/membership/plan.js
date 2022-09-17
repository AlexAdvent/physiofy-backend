var mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
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

const Membership = mongoose.model('Plan', planSchema)
module.exports = Item;
