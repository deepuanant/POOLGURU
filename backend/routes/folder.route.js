const express = require('express');
const router = express.Router();
const {create,findAsPerUser,findOneFolder,update,deleteFolder,deleteAllFolders}=require('../controller/folder.controller')
const {authenticateToken}= require('../middleware/auth.middleware')

router.post('/create',authenticateToken,create);
router.get('/find',authenticateToken,findAsPerUser);
router.get('/find/:folderid',authenticateToken,findOneFolder);
router.put('/update/:folderid',authenticateToken,update);
router.delete('/delete/:folderid',authenticateToken,deleteFolder);
router.delete('/deleteAll',authenticateToken,deleteAllFolders);

module.exports = router;