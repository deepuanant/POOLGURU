const mongoose = require("mongoose");
const { time } = require("speakeasy");

const contactSchema = new mongoose.Schema({

   
     FirstName: {
        type: String,
        required: true
        },
     LastName: {
        type: String,
        required: true
        },
    JobTitle: {
        type: String,
        required: true
       },
     CompanyName: {
        type: String,
        required: true 
        },
    PhoneNo: {
        type: String,
        required: true
        },
    Email: { 
        type: String, 
        required: true
        },
    AnnualRevenue: {
        type: String,
        required: true 
        },
    CompanySize: {
        type: String,
        required: true 
        },
    Subject: {
        type: String, 
        required: true 
        },
    Message: {
        type: String, 
        required: true 
        },
    seenstatus: {
        type: Boolean,
        default: false
        },
    createdAt: {
        type: Date,
        default: Date.now
        }
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;