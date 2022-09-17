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

const Item = mongoose.model('Item', itemSchema)
module.exports = Item;
