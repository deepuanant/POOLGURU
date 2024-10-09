const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    dateofDisbursement: String,
    dealName: String,
    disbursedAmount: Number,
    totalPoolOutstanding: Number,
    rateOfInterest: Number,
    noOfObligors: Number,
    assignees: String,
    assignor: String,
    assigneeShare: Number,
    assignorShare: Number,
    trustee: String,
    natureOfLoans: String,
    principalPortion: Number,
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},
    {
        timestamps: true,
    }
);

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;