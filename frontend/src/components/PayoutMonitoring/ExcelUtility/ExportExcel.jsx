import React, { useState } from "react";
import { RiFileExcel2Fill } from "react-icons/ri";
import ExcelJS from "exceljs";

function ExportExcel({ proccessedData, setProccessedData }) {
  // console.log("data to get into excel", proccessedData);
  let newprocessedData = proccessedData;

  async function rearrangeData(dataArray, newHeaderOrder) {
    // Extract the current headers (0th array in the dataArray)
    const headers = dataArray[0];

    // Create a mapping of the current header index positions
    const headerIndexMap = headers.reduce((acc, header, index) => {
      acc[header] = index;
      return acc;
    }, {});

    // Create a new array to hold the rearranged data
    const rearrangedData = [];

    // First, push the new header order to the result array
    rearrangedData.push(newHeaderOrder);

    // Loop through the data (starting from index 1, as 0th is header)
    for (let i = 1; i < dataArray.length; i++) {
      const currentRow = dataArray[i];
      const newRow = [];

      // Rearrange the data according to the newHeaderOrder
      for (let header of newHeaderOrder) {
        const columnIndex = headerIndexMap[header];
        newRow.push(currentRow[columnIndex]);
      }

      rearrangedData.push(newRow);
    }

    return rearrangedData;
  }

  async function generateDynamicHeaders(
    baseHeaders,
    previousMonths,
    currentmonth
  ) {
    const dynamicHeaders = [...baseHeaders]; // Start with base headers

    for (let i = previousMonths.length - 1; i >= 0; i--) {
      let month = previousMonths[i];
      dynamicHeaders.push(`${month} Charge Overdue`);
      dynamicHeaders.push(`${month} Interest Overdue`);
      dynamicHeaders.push(`${month} Principal Overdue`);
    }

    // Add the current month headers

    dynamicHeaders.push(`${currentmonth} Charge Overdue`);
    dynamicHeaders.push(`${currentmonth} Interest Overdue`);
    dynamicHeaders.push(`${currentmonth} Principal Overdue`);
    for (let i = previousMonths.length - 1; i >= 0; i--) {
      let month = previousMonths[i];
      dynamicHeaders.push(`${month} Assignee ISR`);
    }
    dynamicHeaders.push(`${currentmonth} Assignee ISR`);
    dynamicHeaders.push(`${currentmonth} Assignee Principal Share`);
    dynamicHeaders.push(`${currentmonth} Assignee Interest Share`);
    dynamicHeaders.push(`${currentmonth} Assignee Closing Balance`);
    dynamicHeaders.push(`${currentmonth} Assignee Principal Overdue`);
    dynamicHeaders.push(`${currentmonth} Assignee Interest Overdue`);
    dynamicHeaders.push("Arrear Days");
    dynamicHeaders.push("Final NPA");
    dynamicHeaders.push("Closing Charge Overdue");
    dynamicHeaders.push("Closing Interest Overdue");
    dynamicHeaders.push("Closing Principal Overdue");
    dynamicHeaders.push("Closing Balance");

    return dynamicHeaders;
  }

  const getfile = async () => {
    for (let i = 0; i < proccessedData.length; i++) {
      let previousMonths = proccessedData[i].previousMonthArray;
      // console.log(previousMonths);
      const currentmonth = proccessedData[i].month;
      const data = proccessedData[i].data;

      const baseHeaders = [
        "Deal Name",
        "Proposal No",
        "Collection Month",
        "Current Payout Date",
        "Rate of Interest",
        "Opening POS (Incl Principle Overdue) (100%)",
        "Customer Billing",
        "Billing Principal",
        "Billing Interest",
        "Billing Prepayment",
        "Charges",
        "Customer Collections",
        "Opening Charge Overdue",
        "Opening Interest Overdue",
        "Opening Principal Overdue",
        "Overdue Charges",
        "Overdue Interest",
        "Overdue Principal",
        "Current Charges",
        "Current Interest",
        "Current Principal",
        "Prepayment",
        "Advance",
      ];

      const newHeaderOrder = await generateDynamicHeaders(
        baseHeaders,
        previousMonths,
        currentmonth
      );
      const rearrangedData = await rearrangeData(data, newHeaderOrder);
      newprocessedData[i].data = rearrangedData;
    }

    await createExcelWorkbook(newprocessedData);
  };

  async function createExcelWorkbook(processedData) {
    if (!processedData || processedData.length === 0) {
      console.error("No data available for download");
      return;
    }

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();

    processedData.forEach((obj) => {
      const monthName = obj.month;
      const sheetData = obj.data;
      const currentMonth = obj.month;
      const lengthOfMonth = obj.previousMonthArray.length;
      const lastMonth = obj.previousMonthArray[lengthOfMonth - 1];

      // Add a worksheet for each month
      const worksheet = workbook.addWorksheet(monthName);

      // Get the headers from the data
      const headers = sheetData[0];
      // console.log(headers);
      if (obj.previousMonthArray.length > 0) {
        const ranges = [
          {
            start: headers.indexOf("Deal Name"),
            end: headers.indexOf("Customer Collections"),
            text: "INPUT DATA",
            color: "FFD700", // Yellow
          },
          {
            start: headers.indexOf("Opening Charge Overdue"),
            end: headers.indexOf("Opening Principal Overdue"),
            text: "OPENING OVERDUE",
            color: "32CD32", // Green
          },
          {
            start: headers.indexOf("Overdue Charges"),
            end: headers.indexOf("Advance"),
            text: "CURRENT COLLECTION DISTRIBUTION",
            color: "87CEEB", // Light Blue
          },
          {
            start: headers.indexOf(`${lastMonth} Charge Overdue`),
            end: headers.indexOf(`${currentMonth} Principal Overdue`),
            text: "CLOSING OVERDUE 100%",
            color: "FFA500", // Light Salmon
          },
          {
            start: headers.indexOf(`${lastMonth} Assignee ISR`),
            end: headers.indexOf(`${currentMonth} Assignee ISR`),
            text: `ASSIGNEE ISR ${proccessedData[0].settings.assigneeShare}%`,
            color: "FFD700", // Gold
          },
          {
            start: headers.indexOf(`${currentMonth} Assignee Principal Share`),
            end: headers.indexOf(`${currentMonth} Assignee Closing Balance`),
            text: `CURRENT ASSIGNEE SHARE ${proccessedData[0].settings.assigneeShare}%`,
            color: "FFB6C1", // Hot Pink
          },
          {
            start: headers.indexOf(
              `${currentMonth} Assignee Principal Overdue`
            ),
            end: headers.indexOf(`${currentMonth} Assignee Interest Overdue`),
            text: `ASSIGNEE OVERDUES ${proccessedData[0].settings.assigneeShare}%`,
            color: "FF4500", // Tomato
          },
          {
            start: headers.indexOf("Arrear Days"),
            end: headers.indexOf("Final NPA"),
            text: "NPA CLASSIFICATION",
            color: "FF8C00", // Orange
          },
          {
            start: headers.indexOf("Closing Charge Overdue"),
            end: headers.indexOf("Closing Balance"),
            text: "CLOSING",
            color: "DC143C", // Red
          },
        ];

        const borderStyle = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Ensure that row 1 (headerGrouping) exists before accessing cells
        const row1 = worksheet.addRow(new Array(headers.length).fill(""));

        // Add the grouping row and headers into the worksheet
        ranges.forEach((range) => {
          row1.getCell(range.start + 1).value = range.text;
          row1.getCell(range.start + 1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: range.color },
          };
          row1.getCell(range.start + 1).font = {
            bold: true,
            color: { argb: "000000" },
          };
          row1.getCell(range.start + 1).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
          row1.getCell(range.start + 1).border = borderStyle;

          // Merge cells for each range in the headerGrouping
          worksheet.mergeCells(1, range.start + 1, 1, range.end + 1);
        });

        // Add the actual headers
        const row2 = worksheet.addRow(headers);

        // Apply the same styles for the actual headers as the headerGrouping
        ranges.forEach((range) => {
          for (let col = range.start + 1; col <= range.end + 1; col++) {
            const cell = row2.getCell(col); // Get the corresponding cell in row 2
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: range.color }, // Use the same color as the grouping header
            };
            cell.font = { bold: true, color: { argb: "000000" } };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
            cell.border = borderStyle;
          }
        });
        // Insert data rows
        sheetData.slice(1).forEach((rowData) => {
          const row = worksheet.addRow(rowData);
          row.eachCell((cell) => {
            cell.border = borderStyle;
          });
        });

        // Adjust column widths
        headers.forEach((header, index) => {
          worksheet.getColumn(index + 1).width = 17;
        });
      } else {
        const ranges = [
          {
            start: headers.indexOf("Deal Name"),
            end: headers.indexOf("Customer Collections"),
            text: "INPUT DATA",
            color: "FFD700", // Yellow
          },
          {
            start: headers.indexOf("Opening Charge Overdue"),
            end: headers.indexOf("Opening Principal Overdue"),
            text: "OPENING OVERDUE",
            color: "32CD32", // Green
          },
          {
            start: headers.indexOf("Overdue Charges"),
            end: headers.indexOf("Advance"),
            text: "CURRENT COLLECTION DISTRIBUTION",
            color: "87CEEB", // Light Blue
          },
          {
            start: headers.indexOf(`${currentMonth} Charge Overdue`),
            end: headers.indexOf(`${currentMonth} Principal Overdue`),
            text: "CLOSING OVERDUE 100%",
            color: "FFA500", // Light Salmon
          },
          {
            start: headers.indexOf(`${currentMonth} Assignee ISR`),
            end: headers.indexOf(`${currentMonth} Assignee ISR`),
            text: `ASSIGNEE ISR ${proccessedData[0].settings.assigneeShare}%`,
            color: "FFD700", // Gold
          },
          {
            start: headers.indexOf(`${currentMonth} Assignee Principal Share`),
            end: headers.indexOf(`${currentMonth} Assignee Closing Balance`),
            text: `CURRENT ASSIGNEE SHARE ${proccessedData[0].settings.assigneeShare}%`,
            color: "FFB6C1", // Hot Pink
          },
          {
            start: headers.indexOf(
              `${currentMonth} Assignee Principal Overdue`
            ),
            end: headers.indexOf(`${currentMonth} Assignee Interest Overdue`),
            text: `ASSIGNEE OVERDUES ${proccessedData[0].settings.assigneeShare}%`,
            color: "FF4500", // Tomato
          },
          {
            start: headers.indexOf("Arrear Days"),
            end: headers.indexOf("Final NPA"),
            text: "NPA CLASSIFICATION",
            color: "FF8C00", // Orange
          },
          {
            start: headers.indexOf("Closing Charge Overdue"),
            end: headers.indexOf("Closing Balance"),
            text: "CLOSING",
            color: "DC143C", // Red
          },
        ];

        const borderStyle = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Ensure that row 1 (headerGrouping) exists before accessing cells
        const row1 = worksheet.addRow(new Array(headers.length).fill(""));

        // Add the grouping row and headers into the worksheet
        ranges.forEach((range) => {
          row1.getCell(range.start + 1).value = range.text;
          row1.getCell(range.start + 1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: range.color },
          };
          row1.getCell(range.start + 1).font = {
            bold: true,
            color: { argb: "000000" },
          };
          row1.getCell(range.start + 1).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
          row1.getCell(range.start + 1).border = borderStyle;

          // Merge cells for each range in the headerGrouping
          worksheet.mergeCells(1, range.start + 1, 1, range.end + 1);
        });

        // Add the actual headers
        const row2 = worksheet.addRow(headers);

        // Apply the same styles for the actual headers as the headerGrouping
        ranges.forEach((range) => {
          for (let col = range.start + 1; col <= range.end + 1; col++) {
            const cell = row2.getCell(col); // Get the corresponding cell in row 2
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: range.color }, // Use the same color as the grouping header
            };
            cell.font = { bold: true, color: { argb: "000000" } };
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
              wrapText: true,
            };
            cell.border = borderStyle;
          }
        });
        // Insert data rows
        sheetData.slice(1).forEach((rowData) => {
          const row = worksheet.addRow(rowData);
          row.eachCell((cell) => {
            cell.border = borderStyle; // Apply border to all cells in each row
          });
        });

        // Adjust column widths
        headers.forEach((header, index) => {
          worksheet.getColumn(index + 1).width = 17;
        });
      }
    });

    // Write the workbook to a file
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Trigger download in the browser
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "DetailReport.xlsx";
    anchor.click();

    // Clean up the URL
    window.URL.revokeObjectURL(url);
    setProccessedData(null);
    // console.log("Workbook created successfully!");
  }

  return (
    <div className="group relative flex items-center">
      {/* Export Button with Notification Dot */}
      <div
        className="flex m-auto cursor-pointer duration-300 hover:scale-110  text-orange-500 hover:text-orange-400"
        title="Detail report"
        onClick={() => getfile()}
      >
        <button className="relative   focus:outline-none transition-transform transform ">
          {/* Export Icon */}
          <RiFileExcel2Fill size={16} />
          {/* Notification Dot when data is available */}
          {proccessedData && proccessedData.length > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-blue-500 bg-blue-500 animate-ping bg-opacity-100"></span>
          )}
        </button>
        <span className="m-auto font-medium text-xs hidden lg:inline">
          Detail
        </span>
      </div>

      {/* Tooltip for Excel Export */}
      {/* <div className="absolute top-full mt-2 hidden group-hover:block w-max px-2 text-sm text-white bg-black rounded-md">
        Detail Report
      </div> */}
    </div>
  );
}

export default ExportExcel;
