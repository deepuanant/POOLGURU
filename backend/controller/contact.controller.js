const Contact = require("../models/contact.model");

const createMessage = async (req, res) => {
    const { FirstName, LastName, JobTitle, CompanyName, PhoneNo, Email, AnnualRevenue, CompanySize, Subject, Message } = req.body.form;
    console.log(FirstName, LastName, JobTitle, CompanyName, PhoneNo, Email, AnnualRevenue, CompanySize, Subject, Message);

    if(!FirstName || !LastName || !JobTitle || !CompanyName || !PhoneNo || !Email || !AnnualRevenue || !CompanySize || !Subject || !Message) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
        const newContact = new Contact({ FirstName, LastName, JobTitle, CompanyName, PhoneNo, Email, AnnualRevenue, CompanySize, Subject, Message });
        await newContact.save();
    
        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Failed to send message", error: error.message });
    }
    }

const getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json({ messages });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Failed to fetch messages", error: error.message });
    }
    }

const deleteMessage = async (req, res) => {
    try {
        const message = await Contact.findByIdAndDelete(req.params.id);
        if (!message) {
        return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Failed to delete message", error: error.message });
    }
    }

    const updateseenstatus = async (req, res) => {
        try {
            const {seenstatus} = req.body
            const message = await Contact.findByIdAndUpdate(req.params.id, {seenstatus}, { new: true });
            if (!message) {
            return res.status(404).json({ message: "Message not found" });
            }
            res.status(200).json({ message: "Message updated successfully" });
        }
        catch (error) {
            res
            .status(500)
            .json({ message: "Failed to update message", error: error.message });
        }
        }

    







module.exports = { createMessage, getMessages,deleteMessage,updateseenstatus };
