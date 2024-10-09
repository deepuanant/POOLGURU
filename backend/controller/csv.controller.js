const XLSX = require('xlsx');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const { Readable } = require('stream');

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    let jsonData;

    if (req.file.mimetype === 'text/csv') {
      // If it's a CSV file, parse it directly
      jsonData = await csvToJson(req.file.buffer.toString());
    } else {
      // If it's an Excel file, convert to CSV first
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(sheet);
      jsonData = await csvToJson(csvData);
    }

    // Transform data to column-wise format
    const columnWiseData = transformToColumnWise(jsonData);

    // Save to MongoDB
    const collection = mongoose.connection.collection('template');
    await collection.insertOne(columnWiseData);

    res.status(200).json({ message: 'Data uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading data:', error);
    res.status(500).json({ error: 'Error uploading data.' });
  }
};

// Helper function to convert CSV to JSON
function csvToJson(csvData) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(csvData);

    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Helper function to transform row-wise data to column-wise
function transformToColumnWise(rowWiseData) {
  const columnWiseData = {};

  rowWiseData.forEach((row, index) => {
    Object.keys(row).forEach(key => {
      if (!columnWiseData[key]) {
        columnWiseData[key] = [];
      }
      columnWiseData[key].push(row[key]);
    });
  });

  return columnWiseData;
}
