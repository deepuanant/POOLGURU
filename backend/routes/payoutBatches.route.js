const express = require('express');
const router = express.Router();
const {create,findAll,findOne,deleteById, deleteAll} = require('../controller/payoutbatches.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Create a new Payout
router.post('/add',authenticateToken, create);

// Retrieve all Payouts
router.get('/getAll/:id',authenticateToken, findAll);

// Retrieve a single Payout with id
router.get('/get/:id',authenticateToken,findOne);



// Delete a Payout with id
router.delete('/delete/:id',authenticateToken,deleteById);

// Create a new Payout
router.delete('/delete',authenticateToken, deleteAll);

module.exports = router;