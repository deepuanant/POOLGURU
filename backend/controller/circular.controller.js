const cloudinary = require('cloudinary').v2;
const Circular = require("../models/circular.model.js");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const User = require("../models/user.model.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pdfs',
    allowed_formats: ['pdf']
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
}).single('pdf');


const createCircular = async (req, res) => {
  console.log("Received body:", req.body);
  console.log("Received files:", req.files);

  try {
    const { title, message, url, date } = req.body;
    let pdfUrl = null;

    if (req.files && req.files.pdf) {
      try {
        const result = await cloudinary.uploader.upload(req.files.pdf.tempFilePath, {
          resource_type: 'raw',
          folder: 'pdf',
          format: 'pdf',
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          attachment: true
        });
        pdfUrl = result.secure_url;
        console.log("PDF uploaded successfully:", pdfUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ error: 'Failed to upload PDF.' });
      }
    }
    const users = await User.find({}, '_id');
    const userCircular = users.map(user => ({
      userId: user._id,
      read: false,
    }));


    const Circulars = {
      title,
      message,
      pdfurl: pdfUrl,
      url,
      date,
      users: userCircular
    };

    const save = await Circular.create(Circulars);
    if (save) {
      return res.status(200).json({ message: 'Circular created successfully.' });
    } else {
      return res.status(500).json({ error: 'Failed to create Circular.' });
    }
  } catch (error) {
    console.error("Error in createuserNot:", error);
    return res.status(500).json({ error: 'Failed to create Circular.' });
  }
};

const getCircular = async (req, res) => {
  try {
    const notifications = await Circular.find({});
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

const getCircularofuser = async (req, res) => {
  try {
    const id = req.user.id;
    const circular = await Circular.find({
      'users': { $elemMatch: { userId: id } }
    });
    const result = circular.map(cir => ({
      title: cir.title,
      message: cir.message,
      pdfurl: cir.pdfurl,
      url: cir.url,
      date: cir.date,
      readtime: cir.users.find(user => user.userId.equals(id)).readtime,
      read: cir.users.find(user => user.userId.equals(id)).read,
      createdAt: cir.createdAt
    }));
    res.status(200).json({ message: "Notifications fetched successfully", result });
  }
  catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

const markCircularAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    // Update the read status for the specific user
    await Circular.updateMany(
      { 'users.userId': userId, 'users.read': false },
      { $set: { 'users.$.read': true } },
      { $set: { 'users.$.readtime': new Date() } }
    );

    res.status(200).json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read.' });
  }
}

const updateCircular = async (req, res) => {
  try {
    const { title, message } = req.body;
    const circular = await Circular.findByIdAndUpdate(
      req.params.id,
      { title, message }, // The fields to update
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: 'Circular updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update circular.' });
  }
}

const deleteCircular = async (req, res) => {
  try {
    const circular = await Circular.findByIdAndDelete(req.params.id);
    if (circular) {
      return res.status(200).json({ message: 'Circular deleted successfully.' });
    } else {
      return res.status(404).json({ error: 'Circular not found.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete circular.' });
  }
};

module.exports = { createCircular, getCircular, markCircularAsRead, updateCircular, deleteCircular, getCircularofuser };
