const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');


const {
    createCircular,
    getCircular,
    updateCircular,
    deleteCircular,
    markCircularAsRead,
    getCircularofuser,

} = require('../controller/circular.controller');

router.post('/create', isAdmin, createCircular);
router.get('/get', authenticateToken, getCircular);
router.put('/update/:id', isAdmin, updateCircular);
router.delete('/delete/:id', isAdmin, deleteCircular);
router.put('/markread', authenticateToken, markCircularAsRead);
router.get('/getusercircular', authenticateToken, getCircularofuser);

module.exports = router;
