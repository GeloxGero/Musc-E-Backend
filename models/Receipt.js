const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const receiptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        product: [{
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'Product'
        }],
        total: {
            type: Number,
            required: true
        }, 
        transaction: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

receiptSchema.plugin(AutoIncrement, {
    inc_field: 'record',
    id: 'recordNums',
    start_seq: 30500
})

module.exports = mongoose.model('Receipt', receiptSchema);