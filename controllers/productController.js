const User = require('../models/User')
const Note = require('../models/Note')
const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all product
// @route GET /product
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
    // Get all product from MongoDB
    const product = await Product.find().lean()

    // If no product 
    if (!product?.length) {
        return res.status(400).json({ message: 'No product found' })
    }

    res.json(product)
})

// @desc Create new user
// @route POST /product
// @access Private
const createNewProduct = asyncHandler(async (req, res) => {
    const { name, price, text, quantity } = req.body

    // Confirm data
    if (!name || !price || !text || !quantity) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await Product.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate product' })
    }

 
    const productObject = { name, text, price, quantity }

    const product = await Product.create(productObject)

    if (product) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a product
// @route PATCH /product
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
    const { id, name, text, price, quantity } = req.body

    // Confirm data 
    if (!id || !name || !text || !price || !quantity) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Does the user exist to update?
    const product = await Product.findById(id).exec()

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    // Check for duplicate 
    const duplicate = await Product.findOne({ name }).lean().exec()


    product.name = name
    product.text = text
    product.price = price
    product.quantity = quantity

    const updatedProduct = await product.save()

    res.json({ message: `${updatedProduct.name} updated` })
})

// @desc Delete a product
// @route DELETE /products
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Product ID Required' })
    }

    // Does the user exist to delete?
    const product = await Product.findById(id).exec()

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    const result = await product.deleteOne()

    const reply = `Product ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct
}