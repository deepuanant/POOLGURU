import * as XLSX from "xlsx";

export const processXlsx = async (Sheet, settings) => {
    if (!Sheet) {
        return { message: "No file selected" };
    }
    if (!settings) {
        return { message: "No settings selected" };
    }
    // console.log("Uploaded File:", Sheet);
    // console.log("Settings", settings);

    try {
        // Function to calculate metrics from the Excel data
        const calculateMetrics = (data) => {
            const metrics = data.reduce((acc, row) => {
                acc.totalCollection += parseFloat(row["Customer Collections"]) || 0;
                acc.overdueprincipal += parseFloat(row["Overdue Principal"]) || 0;
                acc.currrentprincipal += parseFloat(row["Current Principal"]) || 0;
                acc.currentintrest += parseFloat(row["Current Interest"]) || 0;
                acc.currentcharges += parseFloat(row["Current Charges"]) || 0;
                acc.prepayment += parseFloat(row["Prepayment"]) || 0;
                acc.totalCharges += parseFloat(row["Charges"]) || 0;
                acc.openingOverduePrinciple += parseFloat(row["Opening Principle Overdue (100%)"]) || 0;
                acc.openingInterestOverdue += parseFloat(row["Opening Interest Overdue (100%)"]) || 0;
                acc.billingPrincipal += parseFloat(row["Billing Principal"]) || 0;
                acc.billingInterest += parseFloat(row["Billing Interest"]) || 0;
                acc.billingPrepayment += parseFloat(row["Billing Prepayment"]) || 0;
                acc.openingBalance += parseFloat(row["Opening POS (Incl Principle Overdue) (100%)"]) || 0;
                acc.overdueinterest += parseFloat(row["Overdue Interest"]) || 0;
                acc.assigneeprincipalshare += parseFloat(row[`${actualmonth} Assignee Principal Share`]) || 0;
                acc.assigneeinterestshare += parseFloat(row[`${actualmonth} Assignee Interest Share`]) || 0;
                acc.closingbalance += parseFloat(row["Closing Balance"]) || 0;
                acc.closingprinoverdue = parseFloat(row["Closing Principal Overdue"]) || 0;
                acc.closingintoverdue = parseFloat(row["Closing Interest Overdue"]) || 0;

                return acc;
            }, {
                totalCollection: 0,
                totalCharges: 0,
                overdueprincipal: 0,
                currrentprincipal: 0,
                currentintrest: 0,
                currentcharges: 0,
                prepayment: 0,
                openingOverduePrinciple: 0,
                openingInterestOverdue: 0,
                billingPrincipal: 0,
                billingInterest: 0,
                billingPrepayment: 0,
                openingBalance: 0,
                overdueinterest: 0,
                assigneeprincipalshare: 0,
                assigneeinterestshare: 0,
                closingbalance: 0,
                closingprinoverdue: 0,
                closingintoverdue: 0,
            });

            metrics.totalDue = metrics.openingOverduePrinciple + metrics.openingInterestOverdue + metrics.billingPrincipal + metrics.billingInterest;
            metrics.shortPayment = metrics.totalCollection - (metrics.totalDue + metrics.billingPrepayment + metrics.totalCharges);
            metrics.closingBalance = metrics.openingBalance - (metrics.billingPrepayment + metrics.billingPrincipal);
            metrics.assignorOpening = parseInt(metrics.openingBalance * (settings.assignorShare / 100)) || 0;
            metrics.assigneeOpening = parseInt(metrics.openingBalance * (settings.assigneeShare / 100)) || 0;
            metrics.assignorClosing = parseInt(metrics.openingBalance * 0.90) - (metrics.billingPrepayment + metrics.billingPrincipal);
            metrics.assigneeClosing = parseInt(metrics.openingBalance * 0.10) - 0;
            metrics.openingpos = parseFloat(metrics.openingBalance) || 0;
            metrics.totalprincipalcollection = parseFloat(metrics.currrentprincipal) + parseFloat(metrics.overdueprincipal) + parseFloat(metrics.prepayment) || 0;

            return metrics;
        };

        // Function to calculate distinct values and their metrics based on 'Final NPA'
        const calculateNpaMetrics = (data, currmonth) => {
            const npaMetrics = data.reduce((acc, row) => {
                const finalNpa = row["Final NPA"];
                if (!finalNpa) return acc; // Skip rows without 'Final NPA'

                if (!acc[finalNpa]) {
                    acc[finalNpa] = {
                        count: 0,
                        assigneeClosingBalanceSum: 0,
                        assigneePrincipalOverdueSum: 0,
                        assigneeInterestOverdueSum: 0
                    };
                }

                acc[finalNpa].count += 1;
                acc[finalNpa].assigneeClosingBalanceSum += parseFloat(row[`${currmonth} Assignee Closing Balance`]) || 0;
                acc[finalNpa].assigneePrincipalOverdueSum += parseFloat(row[`${currmonth} Assignee Principal Overdue`]) || 0;
                acc[finalNpa].assigneeInterestOverdueSum += parseFloat(row[`${currmonth} Assignee Interest Overdue`]) || 0;

                return acc;
            }, {});

            // Convert the result into an array of objects
            return Object.keys(npaMetrics).map(finalNpa => ({
                finalNpa,
                count: npaMetrics[finalNpa].count,
                assigneeClosingBalanceSum: npaMetrics[finalNpa].assigneeClosingBalanceSum,
                assigneePrincipalOverdueSum: npaMetrics[finalNpa].assigneePrincipalOverdueSum,
                assigneeInterestOverdueSum: npaMetrics[finalNpa].assigneeInterestOverdueSum
            }));
        };



        const calculatetotalageing = (data, currmonth) => {
            const npaMetrics = data.reduce((acc, row) => {
                const finalNpa = row["Final NPA"];
                if (!finalNpa) return acc; // Skip rows without 'Final NPA'

                if (!acc[finalNpa]) {
                    acc[finalNpa] = {
                        count: 0,
                        ClosingBalanceSum: 0,
                        ClosingPrincipalOverdueSum: 0,
                        ClosingInterestOverdueSum: 0
                    };
                }

                acc[finalNpa].count += 1;
                acc[finalNpa].ClosingBalanceSum += parseFloat(row[`Closing Balance`]) || 0;
                acc[finalNpa].ClosingPrincipalOverdueSum += parseFloat(row[`Closing Principal Overdue`]) || 0;
                acc[finalNpa].ClosingInterestOverdueSum += parseFloat(row[`Closing Interest Overdue`]) || 0;

                return acc;
            }, {});

            // Convert the result into an array of objects
            return Object.keys(npaMetrics).map(finalNpa => ({
                finalNpa,
                count: npaMetrics[finalNpa].count,
                ClosingBalanceSum: npaMetrics[finalNpa].ClosingBalanceSum,
                ClosingPrincipalOverdueSum: npaMetrics[finalNpa].ClosingPrincipalOverdueSum,
                ClosingInterestOverdueSum: npaMetrics[finalNpa].ClosingInterestOverdueSum
            }));
        };

        const array = Sheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = Sheet[2][month];
        const actualname = actualmonth.split("-")[0];

        // Extract deal name
        const indexofdealname = Sheet[0].indexOf("Deal Name");
        const dealname = Sheet[2][indexofdealname];
        // console.log("Deal Name:", dealname);

        // Extract the headers and rows from the sheet
        const [headerRow, ...rows] = Sheet;

        if (!headerRow || headerRow.length === 0) {
            return { status: "error", message: "Invalid file format, no headers found" };
        }

        const structuredData = rows.map(row =>
            headerRow.reduce((obj, colName, index) => {
                obj[colName] = row[index];
                return obj;
            }, {})
        );

        const metrics = calculateMetrics(structuredData);
        // console.log("metrics data ", metrics);

        // Calculate metrics based on 'Final NPA'
        const npaMetrics = calculateNpaMetrics(structuredData, actualmonth);
        // console.log("NPA Metrics:", npaMetrics);

        const totalageing = calculatetotalageing(structuredData, actualmonth);
        // console.log("Total Ageing Metrics:", totalageing);

        return {
            status: "success",
            dealname: dealname,
            data: metrics,
            month: actualmonth,
            settings: settings,
            npaMetrics: npaMetrics, // Return NPA metrics array
            totalageing: totalageing // Return Total Ageing metrics array
        };

    } catch (error) {
        return {
            status: "error",
            message: "Error reading the file"
        };
    }
};









