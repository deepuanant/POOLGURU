const Folder = require('../models/folder.model');
const PayoutData = require('../models/Payoutdata.model');


// Create and Save a new Folder with populated fields
exports.create = async (req, res) => {
    try {
        const { folderName, setting, payoutData } = req.body;
        const user = req.user._id;

        if (!folderName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingFolder = await Folder.findOne({ folderName, user });
        if (existingFolder) {
            return res.status(400).json({ message: 'Folder with this name already exists' });
        }

        const folder = new Folder({ folderName, setting, payoutData, user });

        const newFolder = await folder.save();

        const populatedFolder = await Folder.findById(newFolder._id)
            .populate('settings')
            .populate('payoutData')
            .populate({ path: 'user', select: 'firstname lastname email' });

        res.status(201).json({ message: 'Folder created successfully', folder: populatedFolder });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating folder', error: error.message });
    }
};


// Retrieve all Folders from the database.
exports.findAsPerUser = async (req, res) => {
    try {
        const user = req.user._id;

        // Find folders that belong to the user and populate settings, user, and folderName fields
        const folders = await Folder.find({ user: user })
            .populate('settings')
            .select('folderName');  // Only include folderName

        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ message: 'Error getting folders', error: error.message });
        console.error(error);
    }
};



// Find a single Folder with an id
exports.findOneFolder = async (req, res) => {
    const folderid = req.params.id;
    const user = req.user._id;
    try {
        const folder = await Folder.findById({ _id: folderid, user: user })
            .populate('settings')
            .populate('payoutData')
            .populate({ path: 'user', select: 'firstname lastname email' })// Correct capitalization of user fields
           

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({ message: 'Error getting folder', error: error.message });
        console.error(error);
    }
};

// Update a Folder identified by the id in the request
exports.update = async (req, res) => {
    const folderid = req.params.folderid;  // Use req.params.folderid to match the route
    const user = req.user._id;
    const { folderName } = req.body;

    try {
        // Check if another folder with the same name exists for the user
        const existingFolder = await Folder.findOne({ folderName: folderName, user: user, _id: { $ne: folderid } });

        if (existingFolder) {
            return res.status(400).json({ message: 'Folder name already exists' });
        }

        // Find and update the folder
        const folder = await Folder.findOneAndUpdate({ _id: folderid, user: user }, req.body, { new: true });

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Populate fields after update
        const updatedFolder = await Folder.findById(folderid)
            .populate('settings')
            .populate('payoutData')
            .populate({ path: 'user', select: 'firstname lastname email' });

        res.status(200).json({ message: 'Folder updated successfully', folder: updatedFolder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating folder', error: error.message });
        console.error(error);
    }
};



// Delete a Folder with the specified id in the request
exports.deleteFolder = async (req, res) => {
    try {
        const { folderid } = req.params;
        const user = req.user._id;
        const folder = await Folder.findOne({ _id: folderid, user: user });
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        await PayoutData.deleteMany({ _id: { $in: folder.payoutData } });
        await Folder.findByIdAndDelete(folderid);

        res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting folder' });
        console.error(error);
    }
}

//Delete all folders

exports.deleteAllFolders = async (req, res) => {
    try {
        const folder = await Folder.deleteMany();
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        res.json({ message: 'All folders deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Error deleting all folders' });
    }
}
