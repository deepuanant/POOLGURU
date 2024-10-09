const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('excel') || 
    file.mimetype.includes('spreadsheetml') ||
    file.mimetype === 'text/csv'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only Excel or CSV file.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 80 } // 80MB file size limit
});

module.exports = upload;
