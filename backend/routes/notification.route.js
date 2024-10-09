const express = require('express');
const router = express.Router();

const {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    updateNotification,
    deleteNotification,
    getallNotifications,
} = require('../controller/notificationcontroller');



const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/add', isAdmin, createNotification);
router.get('/get', authenticateToken, getNotifications);
router.put('/markread', authenticateToken, markNotificationAsRead);
router.put('/update/:id', isAdmin, updateNotification);
router.delete('/delete/:id', isAdmin, deleteNotification);
router.get('/getall', isAdmin, getallNotifications);




module.exports = router;
