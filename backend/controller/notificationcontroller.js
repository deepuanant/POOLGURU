// controllers/notification.controller.js
const { get } = require("http");
const Notification = require("../models/notification.js");
const User = require("../models/user.model.js");
const { getIo } = require('../config/socketconnet');

// Create new notification



const createNotification = async (req, res) => {

  const { title, message } = req.body;
  // console.log(title, message);
  console.log(req.body);
  const userId = req.user._id;
  try {
    const io = await getIo();
    const users = await User.find({}, '_id');
    const userNotifications = users.map(user => ({
      userId: user._id,
      read: false,
    }));

    const notification = new Notification({
      title: title,
      message: message,
      users: userNotifications,
    });

    await notification.save();

    io.emit('notification', { message: 'New notification created.' });



    res.status(200).json({ message: 'Notification sent to all users.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification.' });
  }
};


// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const id = req.user.id;

    // const notifications = await Notification.find(
    //   { "users.userId": id },
    //   { title: 1, message: 1, users: 1 }
    // );

    // const unreadNotifications = notifications.filter(notification => 
    //   notification.users.some(user => user.userId.equals(id) && !user.read)
    // );

    const notifications = await Notification.find({
      'users': { $elemMatch: { userId: id } }
    });
    // Filter notifications to only include those where the user hasn't read them
    // const unreadNotifications = notifications.filter(notification =>
    //   notification.users.some(user => user.userId.equals(id))
    // );

    // Map the filtered notifications to only include title and message
    const result = notifications.map(notification => ({
      title: notification.title,
      message: notification.message,
      read: notification.users.find(user => user.userId.equals(id)).read,
      createdAt: notification.createdAt
    }));



    res.status(200).json({ message: "Notifications fetched successfully", result });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};



// Mark notification as read for current user

const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    // Update the read status for the specific user
    await Notification.updateMany(
      { 'users.userId': userId, 'users.read': false },
      { $set: { 'users.$.read': true } },
      { $set: { 'users.$.readtime': new Date() } }

    );

    res.status(200).json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read.' });
  }
}


const updateNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    // Log the request parameters and body for debugging
    console.log(req.params.id);
    console.log(req.body);

    // Update the notification with the specified fields
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { title, message }, // The fields to update
      { new: true, runValidators: true }
    );

    // Check if the notification was found and updated
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.status(200).json({ message: 'Notification updated successfully.', notification });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to update notification.' });
  }
}



const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification.' });
  }
}

const getallNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};


module.exports = {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  updateNotification,
  deleteNotification,
  getallNotifications,
};
