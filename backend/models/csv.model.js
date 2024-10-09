const csv = require('csv-parser');
const fs = require('fs');

class CSVModel {
  static processFile(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const processedData = this.processCSVData(results);
          fs.unlinkSync(filePath); // Delete the file after processing
          resolve(processedData);
        })
        .on('error', reject);
    });
  }

  static processCSVData(data) {
    // Implement your data processing logic here
    // This is just a placeholder example
    return data.map(row => ({
      ...row,
      processed: true
    }));
  }
}

module.exports = CSVModel;