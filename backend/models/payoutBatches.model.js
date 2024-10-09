const mongoose = require('mongoose')

const bathcesSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    phases:{
        batchCreated:{
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending'
        },
        validated:{
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending'
        },
        processed:{
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending'
        },
        reportGen:{
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending'
        },
        batchCompleted:{
            type: String,
            enum: ['success', 'failed', 'pending'],
            default: 'pending'
        },
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
   
    })

const Batch = mongoose.model('PayOutBatches', bathcesSchema)

module.exports = Batch
