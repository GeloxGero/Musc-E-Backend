const express = require('express')
const router = express.Router()
const receiptController = require('../controllers/receiptController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(receiptController.getAllReceipts)
    .post(receiptController.createNewReceipt)
    .patch(receiptController.updateReceipt)
    .delete(receiptController.deleteReceipt)

module.exports = router