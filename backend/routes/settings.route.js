const express = require('express');
const router = express.Router();
const {create,findAll,findOne,deleteOne,deleteAll,update}=require('../controller/settings.controller');
const {authenticateToken}=require('../middleware/auth.middleware');

router.post('/create/:folderId',authenticateToken,create);
router.get('/findAll',authenticateToken,findAll);
router.get('/findOne/:folderId',authenticateToken,findOne);
router.delete('/delete/:id',authenticateToken,deleteOne);
router.delete('/deleteAll',authenticateToken,deleteAll);
router.put('/update/:folderId',authenticateToken,update);

module.exports = router;