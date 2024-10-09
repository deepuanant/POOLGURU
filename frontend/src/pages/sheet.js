const XLSX = require('xlsx');

// Function to generate month names between two dates
function generateMonthNames(startDate, endDate) {
    const months = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure we start from the first day of the month
    start.setDate(1);

    // Iterate over each month between the start and end dates
    while (start <= end) {
        const monthName = start.toLocaleString('default', { month: 'long' });
        const year = start.getFullYear();
        months.push({ monthName: `${monthName} ${year}`, subHeaders: ['Principal Overdue', 'Interest Overdue', 'Interest Sharing Ratio'] });
        start.setMonth(start.getMonth() + 1); // Move to the next month
    }
    
    return months;
}

// Load the Excel file
const workbook = XLSX.readFile('Payout_monitoring.xlsx');

// Select the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the sheet data to JSON format (2D array)
let sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Initialize header rows for main columns
let mainHeaderRow = sheetData[0] || [];
let subHeaderRow = new Array(mainHeaderRow.length).fill(''); // Initialize sub-header row with empty values

// Find the indices of the required columns
const collectionMonthColIndex = mainHeaderRow.findIndex(
    (header) => header === "Collection Month"
);
const disbursementDateColIndex = mainHeaderRow.findIndex(
    (header) => header === "Date Of Disbursement"
);



// Extract the dates from the first data row (assuming dates are in the first data row)
const collectionMonth = sheetData[1][collectionMonthColIndex];
const dateOfDisbursement = sheetData[1][disbursementDateColIndex];

// Generate the month names between Date Of Disbursement and Collection Month
const monthNames = generateMonthNames(dateOfDisbursement, collectionMonth);

// Add base columns to the header row
mainHeaderRow.push('Collection Month', 'Date Of Disbursement');
subHeaderRow.push('', ''); // Corresponding empty sub-headers

// Add month columns with sub-headers to the header row
monthNames.forEach(month => {
    mainHeaderRow.push(month.monthName, '', ''); // Add the month name and empty cells for sub-headers
    month.subHeaders.forEach(subHeader => {
        subHeaderRow.push(subHeader);
    });
});

// Populate the sheet data with new columns
sheetData.forEach((row, rowIndex) => {
    if (rowIndex === 0) return; // Skip the header row

    // Add the new columns for Collection Month and Date Of Disbursement
    row.push(collectionMonth, dateOfDisbursement);

    // Add empty data for the new month sub-header columns
    const monthValues = new Array(monthNames.length * 3).fill(''); // 3 sub-headers per month
    row.push(...monthValues);
});

// Insert the sub-header row after the main header row
sheetData.splice(1, 0, subHeaderRow);

// Convert the updated sheet data back to a worksheet
const newWorksheet = XLSX.utils.aoa_to_sheet(sheetData);

// Replace the old worksheet with the new one
workbook.Sheets[sheetName] = newWorksheet;

// Write the updated workbook to a new file
XLSX.writeFile(workbook, 'updatedExcelFile.xlsx');

// console.log('Month columns with sub-headers added successfully!');
