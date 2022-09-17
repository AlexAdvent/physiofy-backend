var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String, required: true,
    },
    sortNumber: {
        type: Number, 
        required: true,
        default: 0,
    },
    active: {
        type: Boolean, 
        default: true,
    },
},
{
    timestamps: true
});
  
const Category = mongoose.model('category', categorySchema)
module.exports = Category;
