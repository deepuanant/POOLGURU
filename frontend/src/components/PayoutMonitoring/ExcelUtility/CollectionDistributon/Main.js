import * as XLSX from "xlsx";
import {
  findcurrentInterest,
  overdues,
  findclosingoverdues,
} from "./Overduecollection";
import { findnetCollection } from "./NETcollection2";
import {
  Isrcalculation,
  AssigneePrincipalShare,
  AssigneeInterestShare,
  AssigneePrincipalOverdue,
  Assigneeclosingbalance,
  AssigneeInterestOverdue,
  closingbalance,
  advance,
  Arreardays,
  CurrentmonthNPA,
  prevmonthNPA,
  finalnpaclassification,
} from "../ISR/ISRcalculation";
import { data } from "autoprefixer";

const downloadSheet = (sheet, fileName) => {
  // Step 1: Create a new worksheet from the modified data
  const worksheet = XLSX.utils.aoa_to_sheet(sheet); // Converts 2D array to sheet

  // Step 2: Create a new workbook and append the modified worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Name of the sheet

  // Step 3: Write the workbook to a file
  XLSX.writeFile(workbook, fileName); // You can pass 'output.xlsx' or any desired filename
};

export const distributionData = async (
  uploadeddata,
  previoussheet,
  settings,
  setmessage
) => {
  const uploadedSheetData = uploadeddata.data;

  // console.log("Uploaded Sheet Data:", uploadedSheetData);
  // console.log("Previous Sheet Data:", previoussheet);

  if (!uploadedSheetData) {
    return { message: "No file selected" };
  }
  try {
    setmessage("Extracting month from uploaded data...");
    const array = uploadedSheetData[0];
    const month = array.indexOf("Collection Month");
    const actualmonth = uploadedSheetData[2][month];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let allsheet;

    async function getPreviousMonth(currMonth) {
      const [currentMonthStr, yearStr] = currMonth.split("-");
      const monthIndex = months.indexOf(currentMonthStr);

      // Check if it's January to handle year change
      let previousMonth;
      let previousYear = yearStr;

      if (monthIndex === 0) {
        // If the current month is January, go to December of the previous year
        previousMonth = months[11];
        previousYear = (parseInt(yearStr) - 1).toString();
      } else {
        previousMonth = months[monthIndex - 1];
      }

      // Return the previous month with the correct year
      return `${previousMonth}-${previousYear}`;
    }

    async function findPreviousMonthData(
      currMonth,
      allData,
      previousdatasheets = [],
      previousmontharray = []
    ) {
      const prevMonth = await getPreviousMonth(currMonth);
      // Find data for the previous month
      const dataForMonth = allData.find((sheet) => sheet.month === prevMonth);

      if (dataForMonth) {
        previousmontharray.push(prevMonth);
        previousdatasheets.push(dataForMonth);
        // Recursively find data for the next previous month
        await findPreviousMonthData(
          prevMonth,
          allData,
          previousdatasheets,
          previousmontharray
        );
      }
      return { previousdatasheets, previousmontharray }; // Return accumulated data sheets
    }

    async function processPreviousData(currMonth) {
      let previousdatasheets = [];
      let previousmontharray = [];

      try {
        // const previousdata = await getpayoutdata(); // Initial data fetch
        // const previousdata = previoussheet.reverse() // Initial data fetch
        const previousdata = [...previoussheet].reverse();
        // console.log("Previous Data:", previousdata);
        if (previousdata.length > 0) {
          allsheet = previousdata;
          // console.log("All Sheets:", allsheet);
          const response = await findPreviousMonthData(currMonth, allsheet);
          previousdatasheets = response.previousdatasheets;
          previousmontharray = response.previousmontharray;
        }
      } catch (error) {
        console.error("Error during processing:", error);
      }

      return { previousdatasheets, previousmontharray }; // Return the found data (or empty if not found)
    }
    setmessage("Processing previous data...");
    const datagot = await processPreviousData(actualmonth);
    const dataofprevious = datagot.previousdatasheets;
    const monthsarray = datagot.previousmontharray;

    // console.log("Previous Data:", dataofprevious);
    // console.log("Previous Months:", monthsarray);

    if (dataofprevious.length > 0) {
      let calculationsheet = JSON.parse(JSON.stringify(uploadedSheetData)); // Deep copy
      // const length = dataofprevious.length - 1;
      const length = 0;

      // console.log("Data of previous:", dataofprevious);
      for (let i = dataofprevious.length - 1; i >= 0; i--) {
        setmessage(`Copying overdue data for ${monthsarray[i]}...`);

        // Overdue Charge
        const lchrindex = dataofprevious[length].data[0].indexOf(
          `${monthsarray[i]} Charge Overdue`
        );
        if (!calculationsheet[0].includes(`${monthsarray[i]} Charge Overdue`)) {
          calculationsheet[0].push(`${monthsarray[i]} Charge Overdue`);
        }
        const cchargeindex = calculationsheet[0].indexOf(
          `${monthsarray[i]} Charge Overdue`
        );

        // Overdue Interest
        const lintindex = dataofprevious[length].data[0].indexOf(
          `${monthsarray[i]} Interest Overdue`
        );
        if (
          !calculationsheet[0].includes(`${monthsarray[i]} Interest Overdue`)
        ) {
          calculationsheet[0].push(`${monthsarray[i]} Interest Overdue`);
        }
        const cintindex = calculationsheet[0].indexOf(
          `${monthsarray[i]} Interest Overdue`
        );

        // Overdue Principal
        const lprindex = dataofprevious[length].data[0].indexOf(
          `${monthsarray[i]} Principal Overdue`
        );
        if (
          !calculationsheet[0].includes(`${monthsarray[i]} Principal Overdue`)
        ) {
          calculationsheet[0].push(`${monthsarray[i]} Principal Overdue`);
        }
        const cprindex = calculationsheet[0].indexOf(
          `${monthsarray[i]} Principal Overdue`
        );

        // ISR Calculation
        const isrindex = dataofprevious[length].data[0].indexOf(
          `${monthsarray[i]} Assignee ISR`
        );
        if (!calculationsheet[0].includes(`${monthsarray[i]} Assignee ISR`)) {
          calculationsheet[0].push(`${monthsarray[i]} Assignee ISR`);
        }
        const cisrindex = calculationsheet[0].indexOf(
          `${monthsarray[i]} Assignee ISR`
        );

        // Loop through the rows to copy the overdue data
        for (let j = 1; j < dataofprevious[length].data.length; j++) {
          // Copy Charge Overdue
          calculationsheet[j][cchargeindex] =
            dataofprevious[length].data[j][lchrindex];

          // Copy Interest Overdue
          calculationsheet[j][cintindex] =
            dataofprevious[length].data[j][lintindex];

          // Copy Principal Overdue
          calculationsheet[j][cprindex] =
            dataofprevious[length].data[j][lprindex];
          // Copy ISR
          calculationsheet[j][cisrindex] =
            dataofprevious[length].data[j][isrindex];
        }
      }
      setmessage("Copying closing overdue data...");
      // Overdue Charge
      const lchrindex = dataofprevious[length].data[0].indexOf(
        `Closing Charge Overdue`
      );
      if (!calculationsheet[0].includes(`Opening Charge Overdue`)) {
        calculationsheet[0].push(`Opening Charge Overdue`);
      }
      const cchargeindex = calculationsheet[0].indexOf(
        `Opening Charge Overdue`
      );

      // Overdue Interest
      const lintindex = dataofprevious[length].data[0].indexOf(
        `Closing Interest Overdue`
      );
      if (!calculationsheet[0].includes(`Opening Interest Overdue`)) {
        calculationsheet[0].push(`Opening Interest Overdue`);
      }
      const cintindex = calculationsheet[0].indexOf(`Opening Interest Overdue`);

      // Overdue Principal
      const lprindex = dataofprevious[length].data[0].indexOf(
        `Closing Principal Overdue`
      );
      if (!calculationsheet[0].includes(`Opening Principal Overdue`)) {
        calculationsheet[0].push(`Opening Principal Overdue`);
      }
      const cprindex = calculationsheet[0].indexOf(`Opening Principal Overdue`);

      // Loop through the rows to copy the overdue data
      for (let j = 1; j < dataofprevious[length].data.length; j++) {
        // Copy Charge Overdue
        calculationsheet[j][cchargeindex] =
          dataofprevious[length].data[j][lchrindex];

        // Copy Interest Overdue
        calculationsheet[j][cintindex] =
          dataofprevious[length].data[j][lintindex];

        // Copy Principal Overdue
        calculationsheet[j][cprindex] =
          dataofprevious[length].data[j][lprindex];
        // Copy ISR
        // calculationsheet[j][cisrindex] = dataofprevious[length].data[j][isrindex];
      }

      setmessage("Adding current month columns...");
      await calculationsheet[0].push(
        `${actualmonth} Charge Overdue`,
        `${actualmonth} Interest Overdue`,
        `${actualmonth} Principal Overdue`,
        `Current Charges`,
        "Current Interest",
        "Current Principal",
        "Prepayment",
        "Net Collection"
      );

      const collindex = calculationsheet[0].indexOf("Customer Collections");
      const chargeindex = calculationsheet[0].indexOf("Charges");
      const netcollectionindex = calculationsheet[0].indexOf("Net Collection");
      const chargeoverdueindex = calculationsheet[0].indexOf(
        `${actualmonth} Charge Overdue`
      );
      const indexcurrentcharges =
        calculationsheet[0].indexOf("Current Charges");
      const currentinterestindex =
        calculationsheet[0].indexOf("Current Interest");
      const currentPrincipalindex =
        calculationsheet[0].indexOf("Current Principal");
      const billingPrincipalindex =
        calculationsheet[0].indexOf("Billing Principal");
      const billinginterestindex =
        calculationsheet[0].indexOf("Billing Interest");
      const remainingPrincipalindex = calculationsheet[0].indexOf("Prepayment");
      const intrestoverdueindex = calculationsheet[0].indexOf(
        `${actualmonth} Interest Overdue`
      );
      const Principaloverdueindex = calculationsheet[0].indexOf(
        `${actualmonth} Principal Overdue`
      );

      setmessage("Calculating net collection...");
      calculationsheet = await findnetCollection(
        calculationsheet,
        collindex,
        chargeindex,
        netcollectionindex,
        chargeoverdueindex,
        indexcurrentcharges,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating current interest...");
      calculationsheet = await findcurrentInterest(
        calculationsheet,
        netcollectionindex,
        currentinterestindex,
        actualmonth,
        billinginterestindex,
        billingPrincipalindex,
        currentPrincipalindex,
        remainingPrincipalindex,
        intrestoverdueindex,
        Principaloverdueindex,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating closing overdues...");
      calculationsheet = await findclosingoverdues(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating overdues...");
      calculationsheet = await overdues(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating ISR...");
      calculationsheet = await Isrcalculation(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee principal share...");
      calculationsheet = await AssigneePrincipalShare(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee interest share...");
      calculationsheet = await AssigneeInterestShare(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee closing balance...");
      calculationsheet = await Assigneeclosingbalance(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee principal overdue...");
      calculationsheet = await AssigneePrincipalOverdue(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee interest overdue...");
      calculationsheet = await AssigneeInterestOverdue(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating closing balance...");
      calculationsheet = await closingbalance(calculationsheet, settings);
      setmessage("Calculating advance...");
      calculationsheet = await advance(calculationsheet, settings);
      setmessage("Calculating arrear days...");
      calculationsheet = await Arreardays(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      // calculationsheet = await CurrentmonthNPA(calculationsheet);
      // calculationsheet = await prevmonthNPA(calculationsheet, dataofprevious, monthsarray);
      setmessage("Finalizing NPA classification...");
      calculationsheet = await finalnpaclassification(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );

      const datatoupload = {
        month: actualmonth,
        data: calculationsheet,
        previousMonthArray: monthsarray,
        settings: settings,
      };
      // downloadSheet(calculationsheet, `${actualmonth} output.xlsx`);

      return {
        status: "success",
        data: datatoupload,
      };
    } else {
      setmessage(
        "No previous data found, initializing new calculation sheet..."
      );
      let calculationsheet = JSON.parse(JSON.stringify(uploadedSheetData));
      // console.log("Calculationsheet:", calculationsheet);

      if (!calculationsheet[0].includes("Opening Charge Overdue")) {
        calculationsheet[0].push("Opening Charge Overdue");
      }
      const cchargeindex = calculationsheet[0].indexOf(
        "Opening Charge Overdue"
      );

      if (!calculationsheet[0].includes("Opening Interest Overdue")) {
        calculationsheet[0].push("Opening Interest Overdue");
      }
      const cintindex = calculationsheet[0].indexOf("Opening Interest Overdue");

      if (!calculationsheet[0].includes("Opening Principal Overdue")) {
        calculationsheet[0].push("Opening Principal Overdue");
      }
      const cprindex = calculationsheet[0].indexOf("Opening Principal Overdue");

      // Loop through the rows to copy the overdue data
      for (let j = 1; j < calculationsheet.length; j++) {
        // Copy Charge Overdue
        calculationsheet[j][cchargeindex] = 0;

        // Copy Interest Overdue
        calculationsheet[j][cintindex] = 0;

        // Copy Principal Overdue
        calculationsheet[j][cprindex] = 0;
        // Copy ISR
        // calculationsheet[j][cisrindex] = dataofprevious[length].data[j][isrindex];
      }
      // calculationsheet[0] = [...calculationsheet[0]]
      await calculationsheet[0].push(
        "Current Charges",
        "Current Interest",
        "Current Principal",
        `${actualmonth} Charge Overdue`,
        `${actualmonth} Interest Overdue`,
        `${actualmonth} Principal Overdue`,
        "Prepayment",
        "Net Collection"
      );
      const netcollectionindex = calculationsheet[0].indexOf("Net Collection");
      const remainingPrincipalindex = calculationsheet[0].indexOf("Prepayment");
      const currentinterestindex =
        calculationsheet[0].indexOf("Current Interest");
      const currentPrincipalindex =
        calculationsheet[0].indexOf("Current Principal");
      const billingPrincipalindex =
        calculationsheet[0].indexOf("Billing Principal");
      const billinginterestindex =
        calculationsheet[0].indexOf("Billing Interest");
      const collindex = calculationsheet[0].indexOf("Customer Collections");
      const chargeindex = calculationsheet[0].indexOf("Charges");
      const chargeoverdueindex = calculationsheet[0].indexOf(
        `${actualmonth} Charge Overdue`
      );
      const intrestoverdueindex = calculationsheet[0].indexOf(
        `${actualmonth} Interest Overdue`
      );
      const Principaloverdueindex = calculationsheet[0].indexOf(
        `${actualmonth} Principal Overdue`
      );
      const indexcurrentcharges =
        calculationsheet[0].indexOf("Current Charges");

      calculationsheet = await findnetCollection(
        calculationsheet,
        collindex,
        chargeindex,
        netcollectionindex,
        chargeoverdueindex,
        indexcurrentcharges,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating current interest...");
      calculationsheet = await findcurrentInterest(
        calculationsheet,
        netcollectionindex,
        currentinterestindex,
        actualmonth,
        billinginterestindex,
        billingPrincipalindex,
        currentPrincipalindex,
        remainingPrincipalindex,
        intrestoverdueindex,
        Principaloverdueindex,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating closing overdues...");
      calculationsheet = await findclosingoverdues(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating overdues...");
      calculationsheet = await overdues(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating ISR...");
      calculationsheet = await Isrcalculation(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee principal share...");
      calculationsheet = await AssigneePrincipalShare(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee interest share...");
      calculationsheet = await AssigneeInterestShare(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee closing balance...");
      calculationsheet = await Assigneeclosingbalance(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee principal overdue...");
      calculationsheet = await AssigneePrincipalOverdue(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating assignee interest overdue...");
      calculationsheet = await AssigneeInterestOverdue(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Calculating closing balance...");
      calculationsheet = await closingbalance(calculationsheet, settings);
      setmessage("Calculating advance...");
      calculationsheet = await advance(calculationsheet, settings);
      setmessage("Calculating arrear days...");
      calculationsheet = await Arreardays(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );
      setmessage("Finalizing NPA classification...");
      calculationsheet = await finalnpaclassification(
        calculationsheet,
        dataofprevious,
        monthsarray,
        settings
      );

      // console.log("Current Interest Sheet:", calculationsheet);

      // const overduecollection = await Overduecollection(calculationsheet, actualmonth);
      // downloadSheet(calculationsheet, `${actualmonth} output.xlsx`);

      // const upload = await uploaddata(overduecollection, actualmonth);

      const datatoupload = {
        month: actualmonth,
        data: calculationsheet,
        previousMonthArray: monthsarray,
        settings: settings,
      };
      // console.log("Data to upload:", datatoupload);

      return {
        status: "success",
        data: datatoupload,
      };
    }
  } catch (error) {
    // console.log("Error in reading the file", error);
    return {
      status: "error",
      message: "Error reading the file",
    };
  }
};
