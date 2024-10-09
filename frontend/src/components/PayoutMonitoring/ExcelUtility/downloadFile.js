import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import file from "./Payout_monitoring.xlsx";

// Generate month names between start and end dates
const generateMonthNames = (startDate, endDate) => {
  const months = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setDate(1);

  while (start <= end) {
    const monthName = start.toLocaleString("default", { month: "long" });
    const year = start.getFullYear();
    months.push({
      monthName: `${monthName} ${year}`,
      subHeaders: [
        "Principal Overdue",
        "Interest Overdue",
        "Interest Sharing Ratio",
      ],
    });
    start.setMonth(start.getMonth() + 1);
  }

  return months;
};

// Validate the workbook before writing
const validateWorkbook = (workbook) => {
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    for (const cellAddress in sheet) {
      if (cellAddress[0] === '!') continue; // Skip special keys
      const cell = sheet[cellAddress];
      if (cell.t === 'z') {
        // Convert error cells to empty string
        cell.t = 's';
        cell.v = '';
      }
    }
  }
  return workbook;
};

// Convert Excel date to JS date
const excelDateToJSDate = (serial) => {
  if (typeof serial !== 'number') {
    return new Date(serial); // If it's already a date string, parse it directly
  }
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;  
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
};

// Updated formatDate function
const formatDate = (date, format = 'dd-mm-yyyy') => {
  if (!(date instanceof Date) || isNaN(date)) {
    return ''; // Return empty string for invalid dates
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  if (format === 'dd-mm-yyyy') {
    return `${day}-${month}-${year}`;
  } else {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${day}-${monthNames[date.getMonth()]}-${year}`;
  }
};
// Generate random data for each row
const generateRandomData = () => {
  return {
    principalOverdue: Math.floor(Math.random() * 10000),
    interestOverdue: Math.floor(Math.random() * 5000),
    interestSharingRatio: (Math.random() * 0.5).toFixed(2),
    rateOfInterest: (Math.random() * (15 - 5) + 5).toFixed(2) // Random rate between 5% and 15%
  };
};

const calculateMetrics = (data) => {
  const metrics = data.reduce((acc, row) => {
      acc.totalCollection += parseFloat(row["Customer Collections"]) || 0;
      acc.totalCharges += parseFloat(row["Charges"]) || 0;
      acc.openingOverduePrinciple += parseFloat(row["Opening Principle Overdue (100%)"]) || 0;
      acc.openingInterestOverdue += parseFloat(row["Opening Interest Overdue (100%)"]) || 0;
      acc.billingPrincipal += parseFloat(row["Billing Principal"]) || 0;
      acc.billingInterest += parseFloat(row["Billing Interest"]) || 0;
      acc.billingPrepayment += parseFloat(row["Billing Prepayment"]) || 0;

      // console.log(acc);
      return acc;
  }, {
      totalCollection: 0,
      totalCharges: 0,
      openingOverduePrinciple: 0,
      openingInterestOverdue: 0,
      billingPrincipal: 0,
      billingInterest: 0,
      billingPrepayment: 0
  });

  metrics.totalDue = metrics.openingOverduePrinciple + metrics.openingInterestOverdue + metrics.billingPrincipal + metrics.billingInterest;
  metrics.shortPayment = metrics.totalCollection - (metrics.totalDue + metrics.billingPrepayment + metrics.totalCharges);

  return metrics;
};

// Process and Download the Excel file
export const downloadExcel = async (
  startDate,
  endDate,
  partpaydate,
  setStartDate,
  setEndDate,
  setPartpaydate,
  setShowModal
) => {
  const loadingToast = toast.loading("Processing the Excel file...");

  if (!startDate || !endDate || !partpaydate) {
    toast.error("Please enter all the required dates.", {
      id: loadingToast,
      duration: 5000,
      position: "top-center",
    });
    return;
  }

  toast.dismiss(loadingToast);

  try {
    const response = await fetch(file);
    const data = await response.arrayBuffer();

    const workbook = XLSX.read(data, { type: "array" });
    const sourceSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sourceSheetName];

    let sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (!sheetData.length) {
      toast.error("The sheet is empty.", {
        id: loadingToast,
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    // Find indices of "Last Payout Date" and "Current Payout Date" columns
    const headerRow = sheetData[0];
    const lastPayoutDateIndex = headerRow.findIndex(col => col === "Last Payout Date");
    const currentPayoutDateIndex = headerRow.findIndex(col => col === "Current Payout Date");

    // Convert sheet data into a structured format
    const structuredData = sheetData.slice(1).map(row => {
      return headerRow.reduce((obj, colName, index) => {
        obj[colName] = row[index];
        return obj;
      }, {});
    });

    // Calculate the metrics
    const metrics = calculateMetrics(structuredData);

    // console.log(metrics);

    // Define headers for the new columns
    const mainHeaderRow = [
      "Collection Month",
      "Date Of Disbursement",
      "Part Payment Date",
      ...(sheetData[0] || []),
      "Rate Of Interest"
    ];

    const subHeaderRow = [
      "",
      "",
      "",
      ...new Array(mainHeaderRow.length - 3).fill(""),
    ];

    const monthNames = generateMonthNames(startDate, endDate);

    // Add columns for month-wise data
    const mergeCells = [];
    let currentColumn = mainHeaderRow.length;

    monthNames.forEach((month) => {
      const startColumn = currentColumn;
      mainHeaderRow.push(month.monthName, "", "");
      month.subHeaders.forEach((subHeader) => {
        subHeaderRow.push(subHeader);
      });
      const endColumn = currentColumn + 2;
      mergeCells.push({
        s: { r: 0, c: startColumn },
        e: { r: 0, c: endColumn },
      });
      currentColumn += 3;
    });

    // Update existing rows or add new ones
    sheetData = sheetData.map((row, rowIndex) => {
      if (rowIndex === 0) return mainHeaderRow;
      if (rowIndex === 1) return subHeaderRow;

      const randomData = generateRandomData();

      const newRow = [
        `${new Date(endDate).toLocaleString("default", {
          month: "long",
        })} ${new Date(endDate).getFullYear()}`,
        formatDate(new Date(startDate), 'dd-mm-yyyy'),  // Format Date of Disbursement
        formatDate(new Date(partpaydate), 'dd-mm-yyyy'),  // Format Part Payment Date
        ...row,
      ];

      // Preserve and format "Last Payout Date" and "Current Payout Date" if they exist
      if (lastPayoutDateIndex !== -1 && row[lastPayoutDateIndex]) {
        const lastPayoutDate = excelDateToJSDate(row[lastPayoutDateIndex]);
        newRow[lastPayoutDateIndex + 3] = formatDate(lastPayoutDate);  // Keep the existing format for these dates
      }
      if (currentPayoutDateIndex !== -1 && row[currentPayoutDateIndex]) {
        const currentPayoutDate = excelDateToJSDate(row[currentPayoutDateIndex]);
        newRow[currentPayoutDateIndex + 3] = formatDate(currentPayoutDate);  // Keep the existing format for these dates
      }

      // Add random Rate of Interest
      newRow.push(`${randomData.rateOfInterest}%`);

      // Add random data for each month column
      monthNames.forEach(() => {
        newRow.push(
          randomData.principalOverdue,
          randomData.interestOverdue,
          randomData.interestSharingRatio
        );
      });

      // Pad the row if it's shorter than the header
      while (newRow.length < mainHeaderRow.length) {
        newRow.push("");
      }

      return newRow;
    });

    const newWorksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Add merged cells
    newWorksheet["!merges"] = mergeCells;

    // Estimate cell width based on content
    const estimateCellWidth = (cellValue) => {
      if (typeof cellValue === "number") {
        return Math.max(5, String(cellValue).length);
      }
      if (!cellValue) return 5;
      return Math.max(5, cellValue.length);
    };

    // Calculate and set column widths
    const columnWidths = [];
    sheetData.forEach((row) => {
      row.forEach((cellValue, colIndex) => {
        const cellWidth = estimateCellWidth(cellValue);
        if (!columnWidths[colIndex] || cellWidth > columnWidths[colIndex]) {
          columnWidths[colIndex] = cellWidth;
        }
      });
    });

    newWorksheet["!cols"] = columnWidths.map((width) => ({ width }));

    // Add styles (borders, background colors, font)
    const headerStyle = {
      fill: {
        patternType: "solid",
        fgColor: { rgb: "FFFF00" }, // Yellow background
      },
      font: { bold: true },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };

    const defaultStyle = {
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Apply styles to headers and subheaders
    const range = XLSX.utils.decode_range(newWorksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);

        if (!newWorksheet[cellRef]) {
          newWorksheet[cellRef] = { t: "s", v: "" };
        }

        if (R === 0 || R === 1) {
          // Apply header style (including yellow background) to first two rows
          newWorksheet[cellRef].s = headerStyle;
        } else {
          // Apply default style (only borders) to all other cells
          newWorksheet[cellRef].s = defaultStyle;
        }

        // Set the cell type for date columns
        if (R > 1) {
          if (C === lastPayoutDateIndex + 3 || C === currentPayoutDateIndex + 3) {
            if (newWorksheet[cellRef].v) {
              newWorksheet[cellRef].t = 's'; // Change to string type
              newWorksheet[cellRef].z = undefined; // Remove date format
            }
          }
        }
      }
    }

    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "base_data");

    // Validate the workbook before writing
    const validatedWorkbook = validateWorkbook(newWorkbook);

    const wbout = XLSX.write(validatedWorkbook, {
      bookType: "xlsx",
      type: "binary",
      cellStyles: true,
      compression: true
    });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Payout_monitoring.xlsx";
    link.click();

    // Reset form fields
    if (setStartDate) setStartDate("");
    if (setEndDate) setEndDate("");
    if (setPartpaydate) setPartpaydate("");
    if (setShowModal) setShowModal(false);

    toast.success("Excel file processed and downloaded successfully!", {
      duration: 5000,
      position: "top-center",
    });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    toast.error("An error occurred while processing the Excel file.", {
      duration: 5000,
      position: "top-center",
    });
  }
};