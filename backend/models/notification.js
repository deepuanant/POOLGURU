// models/notification.model.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      read: { type: Boolean, default: false },
      readtime: { type: Date }
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: '2d' },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
