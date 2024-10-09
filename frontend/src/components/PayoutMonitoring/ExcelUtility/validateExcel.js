import * as XLSX from "xlsx"; // Importing sheetjs for Excel file processing
import { toast } from "react-hot-toast"; // Importing toast for notifications

// Main function to validate the uploaded Excel file
const validatecheck = async (uploaded) => {
    const errorLog = []; // Initialize an array to collect all errors
    // console.log(uploaded);
    // console.log(uploaded[9][7]);

    // List of required headers
    const mainheaders = [
        "Collection Month",
        "Date of Disbursement",
        "Part Payment Date",
        "Deal Name",
        "Proposal No",
        "Frequency",
        "Last Payout Date",
        "Current Payout Date",
        "Opening POS (Incl Principle Overdue) (100%)",
        "Opening Principle Overdue (100%)",
        "Opening Interest Overdue (100%)",
        "Opening Advance received (100%)",
        "Customer Billing",
        "Billing Principal",
        "Billing Interest",
        "Billing Prepayment",
        "Charges",
        "Customer Collections",
        "Opening Balance Assignee Share (90%)",
        "DPD Days",
        "NPA as per Previous month",
        "Rate of Interest",
    ];

    // Convert headers to lowercase for case-insensitive comparison
    const mainheadersLower = mainheaders.map(header => header.toLowerCase());
    const uploadedHeadersLower = uploaded[0].map(header => header.toLowerCase());

    // console.log(mainheadersLower);
    // console.log(uploadedHeadersLower);

    // Function to check if all required headers are present in the uploaded file
    const containsAllElements = (requiredHeaders, uploadedHeaders) => {
        return requiredHeaders.every(header => uploadedHeaders.includes(header));
    };

    // Function to find missing required headers
    const findMissingElements = (requiredHeaders, uploadedHeaders) => {
        return requiredHeaders.filter(header => !uploadedHeaders.includes(header));
    };

    // Function to find duplicate headers in the uploaded file
    const findDuplicates = async (array) => {
        const counts = {};
        const duplicates = [];

        array.forEach((item) => {
            if (item !== "") {
                counts[item] = (counts[item] || 0) + 1;
            }
        });

        for (const item in counts) {
            if (counts[item] > 1) {
                duplicates.push(item);
            }
        }

        return duplicates;
    };

    // Function to check data types of each column based on validation rules
    const checkDatatype = async (column, uploaded) => {
        const indexofcolumn = uploaded[0].indexOf(column); // Find the index of the column in the uploaded data

        // Helper function to validate multiple date formats
        const ismineValidDateFormat = async (str) => {
            // Define multiple date format regex patterns
            const format1 = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
            const format2 = /^\d{2}-[A-Za-z]{3}-\d{2}$/; // DD-MMM-YY
            const format3 = /^\d{2}-[A-Za-z]{3}-\d{4}$/; // DD-MMM-YYYY
            const format4 = /^\d{2}\/\d{2}\/\d{4}$/; // MM/DD/YYYY
            const format5 = /^\d{2}-\d{2}-\d{4}$/; // MM-DD-YYYY
            const format6 = /^\d{2}\/\d{2}\/\d{4}$/; // DD/MM/YYYY
            const format7 = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY
            const format8 = /^[A-Za-z]{3} \d{2}, \d{4}$/; // MMM DD, YYYY

            // Test if the string matches any of the date formats
            return (
                format1.test(str) ||
                format2.test(str) ||
                format3.test(str) ||
                format4.test(str) ||
                format5.test(str) ||
                format6.test(str) ||
                format7.test(str) ||
                format8.test(str)
            );
        };

        // console.log(await ismineValidDateFormat(uploaded[2][4]));
        // Helper function to convert Excel serial date to JavaScript Date
        // const excelDateToJSDate = async (serial) => {
        //     const utcDays = Math.floor(serial - 25569);
        //     const utcValue = utcDays * 86400; // Convert days to seconds
        //     const dateInfo = new Date(utcValue * 1000);

        //     const fractionalDay = serial - Math.floor(serial) + 0.0000001; // Fractional part of the day

        //     let totalSeconds = Math.floor(86400 * fractionalDay);

        //     const seconds = totalSeconds % 60;
        //     totalSeconds -= seconds;
        //     const hours = Math.floor(totalSeconds / (60 * 60));
        //     const minutes = Math.floor(totalSeconds / 60) % 60;

        //     const format = new Date(
        //         dateInfo.getFullYear(),
        //         dateInfo.getMonth(),
        //         dateInfo.getDate(),
        //         hours,
        //         minutes,
        //         seconds
        //     );
        //     const dategot = await formatDate(format);
        //     console.log(dategot)
        //     return isValidDateFormat(dategot);
        // };

        // Helper function to format the date into 'DD-MMM-YY'
        const formatDate = async (date) => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = date.toLocaleString("default", { month: "short" });
            const year = String(date.getFullYear()).slice(-2);
            return `${day}-${month}-${year}`;
        };

        // Helper function to validate the formatted date
        // const isValidDateFormat = (str) => /^\d{2}-[A-Za-z]{3}-\d{2}$/.test(str);

        // Helper function to validate data format for date columns
        const minedataformat = async (serial) => {
            if (typeof serial === "string") {
                const firstcheck = await ismineValidDateFormat(serial);
                const dategot = new Date(serial);
                const dateformat = await formatDate(dategot);
                const datecheck = await ismineValidDateFormat(dateformat);
                if (datecheck || firstcheck) {
                    return true;
                }
            }
            return false;
        };

        // const datecheck = async (date) => {
        //     if (typeof date === "string") {
        //         const mineresult = await minedataformat(date);
        //         return mineresult;
        //     } else {
        //         const exceltojsresult = await excelDateToJSDate(date);
        //         return exceltojsresult;
        //     }
        // };


        // Helper function to validate percentage values
        const isValidPercentage = (value) => {
            if (typeof value === "number") {
                return true;
            }
            const percentageRegex = /^\d+(\.\d+)?%$/; // Matches values like 45%, 4.5%, etc.
            return typeof value === "string" && percentageRegex.test(value);
        };

        // Helper function to validate numeric values
        const isValidNumber = (value) => {
            if (typeof value === "number") return true;
            if (typeof value === "string") {
                const cleanedValue = value.replace(/,/g, "");
                return !isNaN(cleanedValue);
            }
            return false;
        };


        // Date format validation and other helper functions go here...
        // (You can reuse the ones from your original code)

        const validationMap = {
            "Collection Month": "string",
            "Date of Disbursement": minedataformat,
            "Part Payment Date": minedataformat,
            "Deal Name": "string",
            "Proposal No": "string",
            "Frequency": "string",
            "Last Payout Date": minedataformat,
            "Current Payout Date": minedataformat,
            "Opening POS (Incl Principle Overdue) (100%)": isValidNumber,
            "Opening Principle Overdue (100%)": isValidNumber,
            "Opening Interest Overdue (100%)": isValidNumber,
            "Opening Advance received (100%)": isValidNumber,
            "Customer Billing": isValidNumber,
            "Billing Principal": isValidNumber,
            "Billing Interest": isValidNumber,
            "Billing Prepayment": isValidNumber,
            "Charges": isValidNumber,
            "Customer Collections": isValidNumber,
            "Opening Balance Assignee Share (90%)": isValidNumber,
            "DPD Days": isValidNumber,
            "NPA as per Previous month": "string",
            "Rate of Interest": isValidPercentage,
        };

        let check = validationMap[column] || "string"; // Default to "string" if column is not in the map
        if (column === "Current Payout Date") {
            console.log(check);
        }
        // Loop through each cell in the column to check data types
        for (let i = 2; i < uploaded.length; i++) {
            const cellValue = uploaded[i][indexofcolumn];

            // Validate based on the data type in the map
            if (
                check === "number" &&
                typeof cellValue !== "number" &&
                ![
                    "",
                    "-",
                ].includes(cellValue.trim())
            ) {
                errorLog.push(`Invalid data type in column ${column} at row ${i + 1}. Expected number.`);
            } else if (
                check === "string" &&
                typeof cellValue !== "string" &&
                ![
                    "",
                    "-",
                ].includes(cellValue.trim())
            ) {
                errorLog.push(`Invalid data type in column ${column} at row ${i + 1}. Expected string.`);
            } else if (
                typeof check === "function" &&
                !(await check(cellValue)) &&
                ![
                    "",
                    "-",
                ].includes(cellValue.trim())
            ) {
                errorLog.push(`Invalid data type in column ${column} at row ${i + 1}.`);
            }
        }

        return {
            status: errorLog.length > 0 ? "error" : "success",
        };
    };

    // Check for duplicate headers
    const duplicate = await findDuplicates(uploadedHeadersLower);
    if (duplicate.length > 0) {
        errorLog.push(`Duplicate headers found: ${duplicate.join(", ")}`);
    }

    // Check if all required headers are present
    const hasAllHeaders = containsAllElements(mainheadersLower, uploadedHeadersLower);
    if (!hasAllHeaders) {
        const missing = findMissingElements(mainheadersLower, uploadedHeadersLower);
        errorLog.push(`Missing headers found: ${missing.join(", ")}`);
    }

    // Validate data types for each column
    for (let i = 0; i < mainheaders.length; i++) {
        let columnName = uploaded[0][i];
        await checkDatatype(columnName, uploaded);
    }

    if (errorLog.length > 0) {
        toast.error(`Validation failed with errors: ${errorLog.length}`);
        return {
            status: "error",
            message: "Validation failed",
            log: errorLog, // Return all errors in the log
        };
    }

    toast.success("All columns have the correct data type.");
    return {
        status: "success",
        message: "All columns have the correct data type.",
        log: errorLog, // Return empty log on success
    };
};


// Function to validate the uploaded Excel file against the template structure
export const validateUploadedExcel = async (uploadedFile) => {
    if (!uploadedFile) {
        toast.error("No uploaded file or template to validate against.");
        return false;
    }
    try {
        const data = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        // Check if 'base_data' sheet exists
        if (!workbook.SheetNames.includes("base_data")) {
            toast.error("The uploaded file does not contain a 'base_data' sheet.");
            return {
                status: "error",
                message: "Missing 'base_data' sheet in the uploaded file.",
            };
        }

        const worksheet = workbook.Sheets["base_data"];

        // Configure SheetJS to return dates as strings
        const uploadedSheetData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd'
        });


        // Proceed with validation only if the sheet is not empty
        if (uploadedSheetData.length === 0) {
            toast.error("The 'base_data' sheet is empty.");
            return {
                status: "error",
                message: "The 'base_data' sheet is empty.",
            };
        }

        const check = await validatecheck(uploadedSheetData);
        if (check.status === "success") {
            toast.success("The 'base_data' sheet matches the template.");
            return check;
        } else {
            return check;
        }
    } catch (error) {
        console.error("Validation error:", error);
        return {
            status: "error",
            message: "An error occurred during validation.",
        };
    }
};