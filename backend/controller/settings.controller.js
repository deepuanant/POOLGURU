const Settings = require('../models/settings.model');
const Folder = require('../models/folder.model');

// Create and Save a new Setting
exports.create = async (req, res) => {
    try {
        const { folderId } = req.params;  // Assuming folderId is passed in params
        const {
            dateofDisbursement,
            dealName,
            disbursedAmount,
            totalPoolOutstanding,
            rateOfInterest,
            noOfObligors,
            assignees,
            assignor,
            trustee,
            natureOfLoans,
            principalPortion,
            assigneeShare,
            assignorShare
        } = req.body;  // Extract setting details from the request body

        const user = req.user._id;  // Get authenticated user ID

        // Check if the folder exists and belongs to the user
        const folder = await Folder.findOne({ _id: folderId, user });
        if (!folder) {
            return res.status(404).json({ success: false, message: 'Folder not found or does not belong to the user' });
        }

        // Check if a Setting already exists for this Folder
        const existingSetting = await Settings.findOne({ folder: folderId });
        if (existingSetting) {
            return res.status(400).json({ success: false, message: 'A setting for this folder already exists' });
        }

        

        // Create a new setting instance
        const newSetting = new Settings({
            dateofDisbursement,
            dealName,
            disbursedAmount,
            totalPoolOutstanding,
            rateOfInterest,
            noOfObligors,
            assignees,
            assignor,
            assigneeShare,
            assignorShare,
            trustee,
            natureOfLoans,
            principalPortion,
            folder: folderId,  // Associate the setting with the folder
            user  // Associate the setting with the authenticated user
        });

        // Save the setting to the database
        const savedSetting = await newSetting.save();

        // Update the folder to reflect that it has a setting (optional step, depending on your schema)
        folder.settings = savedSetting._id;
        await folder.save();

        // Send a success response
        res.status(201).json({ success: true, message: 'Setting created successfully for the specified folder', data: savedSetting });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ success: false, message: 'Error creating setting', error: error.message });
    }
};

// Retrieve and return all settings from the database
exports.findAll = async (req, res) => {
    try {
        const user = req.user._id;

        // Find settings that belong to the user and populate folder and user fields
        const settings = await Settings.find({ user })
            .populate('folder')
            .populate({ path: 'user', select: 'firstName lastName email' });

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error getting settings', error: error.message });
        console.error(error);
    }
};

// Delete a setting with the specified id in the request
exports.deleteOne = async (req, res) => {
    const settingId = req.params.id;
    const user = req.user._id;
    try {
        const setting = await Settings.findOneAndDelete({ _id: settingId, user });
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.status(200).json({ message: 'Setting deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting setting', error: error.message });
        console.error(error);
    }
};

// Delete all settings for the authenticated user from the database
exports.deleteAll = async (req, res) => {
    const user = req.user._id;
    try {
        const result = await Settings.deleteMany({ user });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No settings found to delete' });
        }

        res.status(200).json({ message: 'All settings deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting settings', error: error.message });
        console.error(error);
    }
};

// Update a setting identified by the id in the request
exports.update = async (req, res) => {
    const {
        dateofDisbursement,
        dealName,
        disbursedAmount,
        totalPoolOutstanding,
        rateOfInterest,
        noOfObligors,
        assignees,
        assignor,
        assigneeShare,
        assignorShare,
        trustee,
        natureOfLoans,
        principalPortion
    } = req.body;

    const folderId = req.params.folderId;  // Get folderId from request parameters
    const user = req.user._id;  // Get user ID from the authenticated user

    try {
        // Find the folder by folderId and ensure it belongs to the authenticated user
        const folder = await Folder.findOne({ _id: folderId, user: user }).populate('settings');

        // If no folder is found, return an error
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found or does not belong to the user' });
        }

        const settingId = folder.settings._id;

      

        // Find the setting by settingId and ensure it belongs to the authenticated user
        const setting = await Settings.findOneAndUpdate(
            { _id: settingId, user: user },  // Match by settingId and user
            {
                dateofDisbursement,
                dealName,
                disbursedAmount,
                totalPoolOutstanding,
                rateOfInterest,
                noOfObligors,
                assignees,
                assignor,
                assigneeShare,
                assignorShare,
                trustee,
                natureOfLoans,
                principalPortion
            },
            { new: true }  // Return the updated document
        );

        // If no setting is found, return an error
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found or does not belong to the user' });
        }

        // Populate the user field to return detailed user info
        const updatedSetting = await Settings.findById(settingId)
            .populate({ path: 'user', select: 'firstName lastName email' });

        res.status(200).json({ message: 'Setting updated successfully', setting: updatedSetting });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error updating setting', error: error.message });
        console.error(error);
    }
};


// Find a single setting with an id
exports.findOne = async (req, res) => {
    const folderId = req.params.folderId;  // Get folderId from request parameters
    const user = req.user._id;  // Get user ID from the authenticated user

    try {
        // Find the folder by folderId and ensure it belongs to the authenticated user
        const folder = await Folder.findOne({ _id: folderId, user: user }).populate('settings');

        // If no folder is found, return an error
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found or does not belong to the user' });
        }

        const settingId = folder.settings._id;

        // Find the setting by settingId and ensure it belongs to the authenticated user
        const setting = await Settings.findOne({ _id: settingId, user })
            .populate('folder')
            .populate({ path: 'user', select: 'firstName lastName email' });

        if (!setting) {
            return res.status(404).json({ message: 'Setting not found' });
        }

        // Update the folder as needed
        await Folder.updateOne({ _id: { $in: setting.folder } }, { /* update operation here */ });

        // Update the settings based on the folder
        await Settings.updateMany({ folder: { $in: setting.folder } }, { /* update operation here */ });

        res.status(200).json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving setting', error: error.message });
        console.error(error);
    }
};
