import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { processXlsx } from "./ProcessExcel";

const generateExcelFile = async (processeddata) => {
  // console.log("ingenerateExcelFile", processeddata);
  const formatNumber = (number) => {
    if (number === null || number === undefined) return "0.00";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getFirstAndLastDay = (monthString) => {
    const monthMap = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const [monthAbbr, year] = monthString.split("-");
    const monthNumber = monthMap[monthAbbr];

    const firstDay = new Date(`20${year}`, monthNumber, 1);
    const lastDay = new Date(
      firstDay.getFullYear(),
      firstDay.getMonth() + 1,
      0
    );

    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString("en-IN", { month: "short" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    };
  };

  // 1. Create a new workbook
  const workbook = new ExcelJS.Workbook();

  // Use for...of to handle asynchronous processing properly
  for (const obj of processeddata) {
    const monthName = obj.month;
    const sheetData = obj.data;
    const currentMonth = obj.month;
    const lengthOfMonth = obj.previousMonthArray.length;
    const lastMonth = obj.previousMonthArray[lengthOfMonth - 1];

    // Calculate the first and last day of the current month
    const { firstDay, lastDay } = getFirstAndLastDay(currentMonth);

    // Make sure to await processXlsx to handle async data processing
    const data = await processXlsx(obj.data, obj.settings);

    // Add a worksheet for each month
    const worksheet = workbook.addWorksheet(monthName);

    // Generate dynamic rows based on npaMetrics data
    const finalNpaOrder = [
      "No-Overdue",
      "SMA-0",
      "SMA-1",
      "SMA-2",
      "Sub-Standard",
      "Doubtful-1",
      "Doubtful-2",
      "Doubtful-3",
      "Loss",
    ];

    const rows = data?.npaMetrics
      ?.map((item) => [
        item.finalNpa, // Particular
        formatNumber(item.count), // Number of customers
        formatNumber(item.assigneeClosingBalanceSum), // POS Incl Overdue
        formatNumber(item.assigneePrincipalOverdueSum), // Principal Overdue
        formatNumber(item.assigneeInterestOverdueSum), // Interest Overdue
      ])
      .sort(
        (a, b) => finalNpaOrder.indexOf(a[0]) - finalNpaOrder.indexOf(b[0])
      );

    // console.log(data?.settings);

    const rows2 = data?.totalageing
      ?.map((item) => [
        item.finalNpa, // Particular
        formatNumber(item.count), // Number of customers
        formatNumber(item.ClosingBalanceSum), // POS Incl Overdue
        formatNumber(item.ClosingPrincipalOverdueSum), // Principal Overdue
        formatNumber(item.ClosingInterestOverdueSum), // Interest Overdue
      ])
      .sort(
        (a, b) => finalNpaOrder.indexOf(a[0]) - finalNpaOrder.indexOf(b[0])
      );

    // Define the data for your worksheet
    const worksheetData = [
      ["Deal Name :", "Grihum Housing Finance Limited"], // Row 1
      ["Collection Month :", "2024-06-15"], // Row 2
      ["Payout Date :", "2024-07-15"], // Row 3
      [], // Row 4 (empty)
      [], // Row 5 (empty)
      ["1. Principal Summary"], // Row 6
      ["Particular", "Grihum Housing Finance Limited", "DBS", "Total"],
      [
        `Opening Balance as on (${firstDay})`,
        formatNumber(data?.data?.assigneeOpening || 0),
        formatNumber(data?.data?.assignorOpening || 0),
        formatNumber(data?.data?.openingBalance || 0),
      ],
      [
        "Principal Collection",
        formatNumber(
          data?.data?.totalprincipalcollection *
            (data?.settings?.assigneeShare / 100) || 0
        ),
        formatNumber(
          data?.data?.totalprincipalcollection *
            (data?.settings?.assignorShare / 100) || 0
        ),
        formatNumber(data?.data?.totalprincipalcollection || 0),
      ],
      [
        `Closing Balance as on (${lastDay})`,
        formatNumber(
          parseInt(
            data?.data?.assigneeOpening -
              data?.data?.totalprincipalcollection *
                (data?.settings?.assigneeShare / 100)
          )
        ),
        formatNumber(
          parseInt(
            data?.data?.assignorOpening -
              data?.data?.totalprincipalcollection *
                (data?.settings?.assignorShare / 100)
          )
        ),
        formatNumber(
          data?.data?.openingBalance - data?.data?.totalprincipalcollection
        ),
      ],
      [],
      [],
      ["2. Total Billing"],
      ["Particular", "Principal", "Interest", "Total"],
      [
        "Current Billing",
        formatNumber(data?.data?.billingPrincipal || 0),
        formatNumber(data?.data?.billingInterest || 0),
        formatNumber(
          (data?.data?.billingInterest || 0) +
            (data?.data?.billingPrincipal || 0)
        ),
      ],
      [
        "Prepayments",
        formatNumber(data?.data?.billingPrepayment || 0),
        "0.00",
        formatNumber(data?.data?.billingPrepayment || 0),
      ],
      [
        "Charges",
        formatNumber(data?.data?.totalCharges || 0),
        "0.00",
        formatNumber(data?.data?.totalCharges || 0),
      ],
      [
        "Total",
        formatNumber(
          (data?.data?.billingPrincipal || 0) +
            (data?.data?.billingPrepayment || 0) +
            (data?.data?.totalCharges || 0)
        ),
        formatNumber(data?.data?.billingInterest || 0),
        formatNumber(
          (data?.data?.billingInterest || 0) +
            (data?.data?.billingPrincipal || 0) +
            (data?.data?.billingPrepayment || 0) +
            (data?.data?.totalCharges || 0)
        ),
      ],
      [],
      [],
      ["3. Total Collection"],
      ["Particular", "Principal", "Interest", "Total"],
      [
        "Current Billing",
        formatNumber(data?.data?.currrentprincipal || 0),
        formatNumber(data?.data?.currentintrest || 0),
        formatNumber(
          data?.data?.currrentprincipal + data?.data?.currentintrest || 0
        ),
      ],
      [
        "Prepayments",
        formatNumber(data?.data?.prepayment || 0),
        "0.00",
        formatNumber(data?.data?.prepayment || 0),
      ],
      [
        "Charges",
        formatNumber(data?.data?.currentcharges || 0),
        "0.00",
        formatNumber(data?.data?.currentcharges || 0),
      ],
      [
        "Overdue",
        formatNumber(data?.data?.overdueprincipal || 0),
        formatNumber(data?.data?.overdueinterest || 0),
        formatNumber(
          data?.data?.overdueprincipal + data?.data?.overdueinterest || 0
        ),
      ],
      [
        "Total",
        formatNumber(
          data?.data?.currrentprincipal +
            data?.data?.prepayment +
            data?.data?.currentcharges +
            data?.data?.overdueprincipal || 0
        ),
        formatNumber(
          data?.data?.currentintrest + data?.data?.overdueinterest || 0
        ),
        formatNumber(
          data?.data?.currrentprincipal +
            data?.data?.currentintrest +
            data?.data?.prepayment +
            data?.data?.currentcharges +
            data?.data?.overdueprincipal +
            data?.data?.overdueinterest || 0
        ),
      ],
      [],
      [],
      ["4. Cash Outflow"],
      ["Particular", "Principal", "Interest", "Charges", "Total"],
      [
        `${data?.settings?.assignees} ${data?.settings?.assigneeShare}%`,
        formatNumber(data?.data?.assigneeprincipalshare || 0),
        formatNumber(data?.data?.assigneeinterestshare || 0),
        formatNumber(
          data?.data?.currentcharges * (data?.settings?.assigneeShare / 100) ||
            0
        ),
        formatNumber(
          data?.data?.assigneeprincipalshare +
            data?.data?.assigneeinterestshare +
            data?.data?.currentcharges *
              (data?.settings?.assigneeShare / 100) || 0
        ),
      ],
      [
        `${data?.settings?.assignor} ${data?.settings?.assignorShare}%`,
        formatNumber(
          data?.data?.currrentprincipal +
            data?.data?.prepayment +
            data?.data?.overdueprincipal -
            (data?.data?.assigneeprincipalshare || 0)
        ),
        formatNumber(
          data?.data?.currentintrest +
            data?.data?.overdueinterest -
            (data?.data?.assigneeinterestshare || 0)
        ),
        formatNumber(
          data?.data?.currentcharges -
            data?.data?.currentcharges *
              (data?.settings?.assigneeShare / 100) || 0
        ),
        formatNumber(
          data?.data?.currrentprincipal +
            data?.data?.prepayment +
            data?.data?.overdueprincipal -
            data?.data?.assigneeprincipalshare +
            (data?.data?.currentintrest +
              data?.data?.overdueinterest -
              data?.data?.assigneeinterestshare) +
            (data?.data?.currentcharges -
              data?.data?.currentcharges *
                (data?.settings?.assigneeShare / 100)) || 0
        ),
      ],
      [
        "Total",
        formatNumber(
          data?.data?.assigneeprincipalshare +
            (data?.data?.currrentprincipal +
              data?.data?.prepayment +
              data?.data?.overdueprincipal -
              data?.data?.assigneeprincipalshare) || 0
        ),
        formatNumber(
          data?.data?.assigneeinterestshare +
            (data?.data?.currentintrest +
              data?.data?.overdueinterest -
              data?.data?.assigneeinterestshare) || 0
        ),
        formatNumber(
          data?.data?.currentcharges * (data?.settings?.assigneeShare / 100) +
            (data?.data?.currentcharges -
              data?.data?.currentcharges *
                (data?.settings?.assigneeShare / 100)) || 0
        ),
        formatNumber(
          data?.data?.assigneeprincipalshare +
            data?.data?.assigneeinterestshare +
            data?.data?.currentcharges * (data?.settings?.assigneeShare / 100) +
            (data?.data?.currrentprincipal +
              data?.data?.prepayment +
              data?.data?.overdueprincipal -
              data?.data?.assigneeprincipalshare +
              (data?.data?.currentintrest +
                data?.data?.overdueinterest -
                data?.data?.assigneeinterestshare) +
              (data?.data?.currentcharges -
                data?.data?.currentcharges *
                  (data?.settings?.assigneeShare / 100))) || 0
        ),
      ],
      // Other rows for Principal Summary...
      [],
      [], // Empty row before dynamic NPA metrics
      [
        "Ageing",
        "No of Customers",
        `POS (${data?.settings?.assignees} Share) including Overdue`,
        `Principal Overdue (${data?.settings?.assignees} Share)`,
        `Interest Overdue (${data?.settings?.assignees} Share)`,
      ],
      // Insert the dynamic rows from data.npaMetrics
      ...rows,
      [], // Empty row before Total Ageing
      [],
      [
        "Ageing",
        "No of Customers",
        `POS including Overdue`,
        `Principal Overdue Share)`,
        `Interest Overdue Share)`,
      ],
      // Insert the dynamic rows from data.totalageing
      ...rows2,
    ];

    // Add rows to the worksheet
    worksheetData.forEach((row) => worksheet.addRow(row));

    // Define border style
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Apply borders to all cells in the sheet
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = borderStyle;
        // Adjust any other styles as necessary
      });
    });

    // Set column widths
    worksheet.columns.forEach((column) => {
      let maxLength = 10; // Default to a minimum width
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellTextLength = cell.value ? cell.value.toString().length : 0;
        if (cellTextLength > maxLength) {
          maxLength = cellTextLength;
        }
      });
      column.width = maxLength + 5; // Add extra space for padding
    });

    // Merge cells as needed
    worksheet.mergeCells("B1:D1"); // Merging cells for 'Deal Name'
    worksheet.mergeCells("B2:D2"); // Merging cells for 'Collection Month'
    worksheet.mergeCells("B3:D3"); // Merging cells for 'Payout Date'
  }

  // Save the workbook as a file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, `${processeddata[0]?.settings?.dealName}_Summary.xlsx`);
};

export default generateExcelFile;
