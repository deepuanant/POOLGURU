const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    folderName:{
        type: String,
        required: true,
    
    },
    settings:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Setting'
    
    },
    payoutData:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayoutData'
    
    }],
   
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    
    },

    },
    {
        timestamps: true,
    }

);

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
