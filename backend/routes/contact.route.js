const express = require('express');
const router = express.Router();
const { createMessage, getMessages,deleteMessage,updateseenstatus } = require('../controller/contact.controller');
const {isAdmin,authenticateToken} = require('../middleware/auth.middleware');

router.post('/contact', createMessage);
router.get('/getcontact',isAdmin, getMessages);
router.delete('/deletecontact/:id',isAdmin, deleteMessage);
router.put('/updateseenstatus/:id',isAdmin, updateseenstatus);


module.exports = router;
