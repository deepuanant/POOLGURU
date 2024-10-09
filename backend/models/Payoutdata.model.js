const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

const payoutDataSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    data: {
        type: [[String]], // Array of arrays, each element will be encrypted
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: true,
    },
}, { timestamps: true });

// Encryption function for a single string
function encryptString(text) {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

// Decryption function for a single string
function decryptString(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Pre-save middleware to encrypt data
payoutDataSchema.pre('save', function (next) {
    if (this.isModified('data')) {
        this.data = this.data.map(row => row.map(encryptString));
    }
    next();
});

// Virtual property to get decrypted data
payoutDataSchema.virtual('decryptedData').get(function () {
    return this.data.map(row => row.map(decryptString));
});

const PayoutData = mongoose.model('PayoutData', payoutDataSchema);

module.exports = PayoutData;