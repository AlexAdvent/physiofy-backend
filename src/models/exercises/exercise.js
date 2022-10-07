var mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    parentCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'category'
    },
    description: {
        type: String,
    },
    gif: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    sortNumber: {
        type: Number,
        required: true,
        default: 0,
    },
},
{
    timestamps: true
});

const Exercise = mongoose.model('Exercise', exerciseSchema)
module.exports = Exercise;
