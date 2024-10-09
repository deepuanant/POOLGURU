const User = require('../models/user.model');
const PayoutData = require('../models/Payoutdata.model');
const Folder = require('../models/folder.model');
const Setting = require('../models/settings.model');


exports.savepayoutdata = async (req, res) => {
    const { month, data } = req.body;
    const folderId = req.params.folderId;
    const userId = req.user._id;

    try {
        // Check if the folder exists and belongs to the user
        const folder = await Folder.findOne({ _id: folderId, user: userId });
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found or does not belong to the user' });
        }

        // Check if payout data for the month already exists in this folder for the user
        const existingPayout = await PayoutData.findOne({ month, user: userId, folder: folderId });
        if (existingPayout) {
            return res.status(409).json({
                message: 'Payout data for this month already exists in the folder',
                payout: existingPayout
            });
        }

        // Create and save new payout data
        const newPayout = new PayoutData({
            month,
            data,  // This will be encrypted in the pre-save middleware
            user: userId,
            folder: folderId  // Associate the payout with the folder
        });

        const savedPayout = await newPayout.save();

        // Optionally, update the folder to add the payout data reference (if folder tracks payouts)
        folder.payoutData.push(savedPayout._id);
        await folder.save();

        const remainingPayoutData = await PayoutData.find({ folder: folderId });

        const decryptedRemainingPayoutData = remainingPayoutData.map(payout => ({
            _id: payout._id,
            month: payout.month,
            data: payout.decryptedData, // Using the virtual property to get decrypted data
            user: payout.user,
            createdAt: payout.createdAt,
            updatedAt: payout.updatedAt
        }));



        res.status(201).json({
            message: 'Payout data saved successfully',
            remainingPayoutData: decryptedRemainingPayoutData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error saving payout data',
            error: error.message
        });
    }
};


exports.getpayoutdata = async (req, res) => {
    const folderId = req.params.folderId;
    const userId = req.user._id;
    

    try {
        // Fetch payout data for the specific folder and user
        const payoutData = await PayoutData.find({ folder: folderId, user: userId });
        const settings = await Setting.findOne({ folder: folderId, user: userId });

        // Decrypt the data before sending the response
        const decryptedPayoutData = payoutData.map(payout => ({
            _id: payout._id,
            month: payout.month,
            data: payout.decryptedData,
            user: payout.user,
            createdAt: payout.createdAt,
            updatedAt: payout.updatedAt,
            settings: settings
        }));

        const datatosend = {
            data: decryptedPayoutData,
            settings: settings
        }

        res.status(200).json(datatosend);
    } catch (error) {
        res.status(500).json({
            message: 'Error getting payout data',
            error: error.message
        });
    }
};


exports.getpayoutdatabyid = async (req, res) => {
    const payoutId = req.params.id;

    try {
        const payoutdata = await PayoutData.findById(payoutId);
        const decryptedPayoutData = {
            _id: payoutdata._id,
            month: payoutdata.month,
            data: payoutdata.decryptedData, // This will be the decrypted array of arrays
            user: payoutdata.user,
            createdAt: payoutdata.createdAt,
            updatedAt: payoutdata.updatedAt
        };
        res.status(200).json(decryptedPayoutData);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error getting payout data',
            error: error.message
        });
    }
}

exports.deletepayoutdata = async (req, res) => {
    const payoutId = req.params.payoutId;

    try {
        // Find the payout data to get the folder ID
        const payoutData = await PayoutData.findById(payoutId);
        if (!payoutData) {
            return res.status(404).json({ message: 'Payout data not found' });
        }

        const folderId = payoutData.folder;

        // Delete the payout data
        const deletedPayout = await PayoutData.findByIdAndDelete(payoutId);

        // Remove the payout data reference from the folder
        await Folder.findByIdAndUpdate(folderId, { $pull: { payoutData: payoutId } });

        // Fetch the updated list of payout data for the folder
        const remainingPayoutData = await PayoutData.find({ folder: folderId });

        const decryptedRemainingPayoutData = remainingPayoutData.map(payout => ({
            _id: payout._id,
            month: payout.month,
            data: payout.decryptedData, // Using the virtual property to get decrypted data
            user: payout.user,
            createdAt: payout.createdAt,
            updatedAt: payout.updatedAt
        }));

        res.status(200).json({
            message: 'Payout data deleted successfully',
            
            remainingPayoutData: decryptedRemainingPayoutData
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting payout data',
            error: error.message
        });
    }
};


exports.deleteallpayoutdata = async (req, res) => {
    const folderId = req.params.folderId;
    const userId = req.user._id;

    try {
        // Delete all payout data for the authenticated user in a specific folder
        const result = await PayoutData.deleteMany({ folder: folderId, user: userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No payout data found for this folder' });
        }

        res.status(200).json({
            message: 'All payout data for the specified folder deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting payout data for the folder',
            error: error.message
        });
    }
};



