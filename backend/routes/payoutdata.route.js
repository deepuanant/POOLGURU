const {  authenticateToken } = require('../middleware/auth.middleware');
const express = require('express');
const router = express.Router();
const { 
    savepayoutdata, 
    getpayoutdata, 
    getpayoutdatabyid, 
    deleteallpayoutdata, 
    deletepayoutdata 
} = require('../controller/Payoutdata.controller');

// Save payout data for a specific folder (folderId in params)
router.post('/savepayoutdata/:folderId', authenticateToken, savepayoutdata);

// Get all payout data for a specific folder (folderId in params)
router.get('/getpayoutdata/:folderId', authenticateToken, getpayoutdata);

// Get specific payout data by its ID (no folderId needed here)
router.get('/getpayoutdatabyid/:id', authenticateToken, getpayoutdatabyid);

// Delete all payout data for a specific folder (folderId in params)
router.delete('/deleteallpayoutdata/:folderId', authenticateToken, deleteallpayoutdata);

// Delete specific payout data by its ID
router.delete('/deletepayoutdata/:payoutId', authenticateToken, deletepayoutdata);

module.exports = router;
