const express = require('express');
const router = express.Router();
const { uploadExcel } = require('../controller/csv.controller');
const upload = require('../middleware/file.middleware');

router.post('/upload', upload.single('file'), uploadExcel);

module.exports = router;
