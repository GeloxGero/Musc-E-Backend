const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true
        }, 
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Product', productSchema);