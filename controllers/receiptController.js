const Product = require('../models/Product')
const User = require('../models/User')
const Receipt = require('../models/Receipt')
const asyncHandler = require('express-async-handler')

// @desc Get all receipts 
// @route GET /receipts
// @access Private
const getAllReceipts = asyncHandler(async (req, res) => {
    // Get all receipts from MongoDB
    const receipts = await Receipt.find().lean()

    // If no receipts 
    if (!receipts?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const receiptsWithData = await Promise.all(receipts.map(async (receipt) => {
        const user = await User.findById(receipt.user).lean().exec()
        const product = await Product.findById(receipt.product).lean().exec()
        return { ...note, username: user.username, product: product.name}
    }))

    res.json(receiptsWithData)
})

// @desc Create new receipt
// @route POST /receipts
// @access Private
const createNewReceipt = asyncHandler(async (req, res) => {
    const { user, product, total, transaction} = req.body

    // Confirm data
    if (!user || !product || !total || !transaction) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store the new user 
    const receipt = await Receipt.create({ user, product, total, transaction })

    if (receipt) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// @desc Update a receipt
// @route PATCH /receipts
// @access Private
const updateReceipt = asyncHandler(async (req, res) => {
    const { id, user, product, total, transaction } = req.body

    // Confirm data
    if (!id || !user || !product || !total || !transaction) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const receipt = await Receipt.findById(id).exec()

    if (!receipt) {
        return res.status(400).json({ message: 'Receipt not found' })
    }

    receipt.user = user
    receipt.product = product
    receipt.total = total
    receipt.transaction = transaction

    const updatedReceipt = await receipt.save()

    res.json(`Receipt '${updatedReceipt.id}' updated`)
})

// @desc Delete a receipt
// @route DELETE /receipts
// @access Private
const deleteReceipt = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Receipt ID required' })
    }

    // Confirm note exists to delete 
    const receipt = await Receipt.findById(id).exec()

    if (!receipt) {
        return res.status(400).json({ message: 'Receipt not found' })
    }

    const result = await receipt.deleteOne()

    const reply = `Receipt ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllReceipts,
    createNewReceipt,
    updateReceipt,
    deleteReceipt
}