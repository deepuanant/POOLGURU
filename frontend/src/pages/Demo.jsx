import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import file from './Raw_data_1.xlsx';
 

const Demo = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateMonthNames = (startDate, endDate) => {
    const months = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setDate(1);

    while (start <= end) {
      const monthName = start.toLocaleString('default', { month: 'long' });
      const year = start.getFullYear();
      months.push({
        monthName: `${monthName} ${year}`,
        subHeaders: ['col1', 'col2', 'col3'],
      });
      start.setMonth(start.getMonth() + 1);
    }

    return months;
  };

  const processExcel = () => {
    if (!startDate || !endDate) {
      alert('Please select both dates.');
      return;
    }

    // Fetch the Excel file from the public folder
    fetch(file)
      .then(response => response.arrayBuffer())
      .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!sheetData.length) {
          alert('The sheet is empty.');
          return;
        }

        let mainHeaderRow = sheetData[0] || [];
        let subHeaderRow = new Array(mainHeaderRow.length).fill('');

        const monthNames = generateMonthNames(startDate, endDate);

        // Add base columns to the header row
        mainHeaderRow.push('Collection Month', 'Date Of Disbursement');
        subHeaderRow.push('', '');

        // Add month columns with sub-headers to the header row
        monthNames.forEach((month) => {
          mainHeaderRow.push(month.monthName, '', '');
          month.subHeaders.forEach((subHeader) => {
            subHeaderRow.push(subHeader);
          });
        });

        // Populate the sheet data with new columns
        sheetData.forEach((row, rowIndex) => {
          if (rowIndex === 0) return; // Skip the header row

          // Add the new columns for Collection Month and Date Of Disbursement
          row.push(endDate, startDate);

          // Add empty data for the new month sub-header columns
          const monthValues = new Array(monthNames.length * 3).fill('');
          row.push(...monthValues);
        });

        // Insert the sub-header row after the main header row
        sheetData.splice(1, 0, subHeaderRow);

        // Convert the updated sheet data back to a worksheet
        const newWorksheet = XLSX.utils.aoa_to_sheet(sheetData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

        // Create a new file and trigger download
        const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });

        function s2ab(s) {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }

        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'updatedExcelFile.xlsx';
        link.click();
      });
  };

  return (
    <div>
      <h1>Excel Processor</h1>
      <input
        type="date"
        name="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
      />
      <input
        type="date"
        name="endDate"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
      />
      <button onClick={processExcel}>Process and Download File</button>
    </div>
  );
};

export default Demo;