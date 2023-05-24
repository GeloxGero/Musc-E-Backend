const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const receiptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Order'
        },
        title: {
            type: String,
            required: true
        }, 
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

receiptSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 32000
})

module.exports = mongoose.model('Receipt', receiptSchema);