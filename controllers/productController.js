const User = require('../models/User')
const Product = require('../models/Product')
const asyncHandler = require('express-async-handler')

// @desc Get all products
// @route GET /products
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
    // Get all products from MongoDB
    const products = await User.find().select('-password').lean()

    // If no products 
    if (!products?.length) {
        return res.status(400).json({ message: 'No products found' })
    }

    res.json(products)
})

// @desc Create new product
// @route POST /products
// @access Private
const createNewProduct = asyncHandler(async (req, res) => {
    const { name, text, price, quantity, } = req.body

    // Confirm data
    if (!name || !text || !price || !quantity)  {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await Product.findOne({ name }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate product' })
    }

    const productObject = {name, text, price, quantity}

    // Create and store new product 
    const product = await Product.create(productObject)

    if (product) { //created 
        res.status(201).json({ message: `New product ${name} created` })
    } else {
        res.status(400).json({ message: 'Invalid data received' })
    }
})

// @desc Update a product
// @route PATCH /products
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

    // Allow updates to the original product 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate product' })
    }

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

    // Does the product still have stock
    const prod = await Product.findOne({ user: id }).lean().exec()
    if (prod?.quantity > 0) {
        return res.status(400).json({ message: 'Product has stock' })
    }

    // Does the product exist to delete?
    const product = await User.findById(id).exec()

    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    const result = await product.deleteOne()

    const reply = `Item ${product.name} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct
}