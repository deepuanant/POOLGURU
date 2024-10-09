import { current } from "@reduxjs/toolkit";



async function calculateDays(date1Str, date2Str) {
    // Convert the string dates to Date objects
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    // Calculate the difference in milliseconds
    const differenceInTime = date2.getTime() - date1.getTime();

    // Convert milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays;
}

//  Current Month Assignee ISR calculation

export const Isrcalculation = async (currentsheet, previoussheet, previousmontharray) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            // console.log("previous sheet", previoussheet);
            const previousmonth = previousmontharray[0];

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee ISR`);

            const OBASindex = calculationsheet[0].indexOf("Opening Balance Assignee Share (90%)");
            const PMPOindex = calculationsheet[0].indexOf(`Opening Principal Overdue`);
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest")
            const ISRindex = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const lastpayoutindex = previoussheet[0].data[0].indexOf("Current Payout Date");
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            const billingintindex = calculationsheet[0].indexOf("Billing Interest");

            const lastpayoutdate = previoussheet[0].data[1][lastpayoutindex];
            const currentpayoutdate = calculationsheet[2][currentpayoutindex];

            const days = await calculateDays(lastpayoutdate, currentpayoutdate);

            // console.log(parseFloat(calculationsheet[2][ROIindex]))



            for (let i = 1; i < calculationsheet.length; i++) {
                let OBAS = parseFloat(calculationsheet[i][OBASindex]) || 0;
                let PMPO = parseFloat(previoussheet[0].data[i][PMPOindex]) || 0;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let billingint = parseFloat(calculationsheet[i][billingintindex]) || 0;
                let ISR = ((OBAS - (PMPO * 0.90)) * (ROI / 100) * (days / 365)) / billingint;
                calculationsheet[i][ISRindex] = `${(ISR * 100).toFixed(2)}%`;
            }
            // console.log("ISR calculation done", calculationsheet);
            return calculationsheet;




        }
        else {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee ISR`);
            const OBASindex = calculationsheet[0].indexOf("Opening Balance Assignee Share (90%)");
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest")
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            const lastpayoutindex = calculationsheet[0].indexOf("Date of Disbursement");
            const lastpayoutdate = calculationsheet[2][lastpayoutindex];
            const currentpayoutdate = calculationsheet[2][currentpayoutindex];
            const billingintindex = calculationsheet[0].indexOf("Billing Interest");


            const days = await calculateDays(lastpayoutdate, currentpayoutdate);





            const ISRindex = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);


            for (let i = 1; i < calculationsheet.length; i++) {
                let OBAS = parseFloat(calculationsheet[i][OBASindex]) || 0;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let billingint = parseFloat(calculationsheet[i][billingintindex]) || 0;
                let ISR = ((OBAS) * (ROI / 100) * (days / 365)) / billingint;
                calculationsheet[i][ISRindex] = `${(ISR * 100).toFixed(2)}%`;


            }





            return calculationsheet;
        }
    } catch (error) {
        console.error("ISR calculation failed", error);
        return null;
    }


}

// Assignee Principal Share Calculation

export const AssigneePrincipalShare = async (currentsheet, previoussheet, previousmontharray) => {

    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            // console.log("previous sheet", previoussheet);
            const previousmonth = previousmontharray[0];

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Principal Share`);
            const openingprinoverdue = calculationsheet[0].indexOf("Opening Principal Overdue");
            const billingprepayindex = calculationsheet[0].indexOf("Billing Prepayment");
            const CurrentPrincipalindex = calculationsheet[0].indexOf("Current Principal");
            const APSindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Share`);


            for (let i = 1; i < calculationsheet.length; i++) {
                let billingprepay = parseFloat(calculationsheet[i][billingprepayindex]) || 0;
                let currentPrincipal = parseFloat(calculationsheet[i][CurrentPrincipalindex]) || 0;
                let sum = parseFloat(calculationsheet[i][openingprinoverdue]) || 0;

                let APSR = (sum + billingprepay + currentPrincipal) * 0.90;
                calculationsheet[i][APSindex] = APSR;
            }
            // console.log("Assignee Principal Share calculation done", calculationsheet);
            return calculationsheet;


        }
        else {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Principal Share`);

            const APSindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Share`);
            const billingprepayindex = calculationsheet[0].indexOf("Billing Prepayment");
            const CurrentPrincipalindex = calculationsheet[0].indexOf("Current Principal");



            for (let i = 1; i < calculationsheet.length; i++) {
                let billingprepay = parseFloat(calculationsheet[i][billingprepayindex]) || 0;
                let currentPrincipal = parseFloat(calculationsheet[i][CurrentPrincipalindex]) || 0;
                let APSR = (billingprepay + currentPrincipal) * 0.90;
                calculationsheet[i][APSindex] = APSR;
            }
            return calculationsheet;
        }

    }
    catch (error) {
        console.error("Assignee Principal Share calculation failed", error);
        return null;
    }
}


export const AssigneeInterestShare = async (currentsheet, previoussheet, previousmontharray) => {

    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            // console.log("previous sheet", previoussheet);
            const previousmonth = previousmontharray[0];

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));

            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Share`);

            const sumPrevInterestshare = async (sheet, index, monthsarray) => {
                let sum = 0;

                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];

                    let previsrindex = sheet[k].data[0].indexOf(`${month} Assignee ISR`);
                    let previsrinpercent = parseFloat(sheet[k].data[index][previsrindex]) || 0;
                    let previsr = previsrinpercent / 100;
                    let previntrestoverdueindex = sheet[k].data[0].indexOf(`Closing Interest Overdue`);
                    let previntrestoverdue = parseFloat(sheet[k].data[index][previntrestoverdueindex]) || 0;

                    // let previsrindex = sheet[k].data[0].indexOf(`${month} ISR`);
                    // let previsrinpercent = parseFloat(sheet[k].data[index][previsrindex]) || 0;
                    // let previsr = previsrinpercent / 100;
                    // let prevcurrintrest = sheet[k].data[0].indexOf("Current Interest");
                    // let prevcurrint = parseFloat(sheet[k].data[index][prevcurrintrest]) || 0;

                    sum += (previsr * previntrestoverdue);
                }
                return sum;
            }
            const currisr = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const currint = calculationsheet[0].indexOf("Current Interest");
            const AISindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Share`);

            for (let i = 1; i < calculationsheet.length; i++) {
                let currisrpercentinpercentage = parseFloat(calculationsheet[i][currisr]) || 0;
                let currisrpercent = currisrpercentinpercentage / 100;
                let currintrest = parseFloat(calculationsheet[i][currint]) || 0;
                let sum = await sumPrevInterestshare(previoussheet, i, previousmontharray);
                let AISR = (currisrpercent * currintrest) + sum;
                calculationsheet[i][AISindex] = (AISR).toFixed(2);
            }

            // console.log("Assignee Interest Share calculation done", calculationsheet);
            return calculationsheet;
        } else {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Share`);

            const AISindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Share`);
            const currisr = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const currint = calculationsheet[0].indexOf("Current Interest");

            for (let i = 1; i < calculationsheet.length; i++) {
                let currisrpercentpercentage = parseFloat(calculationsheet[i][currisr]) || 0;
                let currisrpercent = currisrpercentpercentage / 100;
                let currintrest = parseFloat(calculationsheet[i][currint]) || 0;
                let AISR = currisrpercent * currintrest;
                calculationsheet[i][AISindex] = (AISR).toFixed(2);
            }
            return calculationsheet;
        }

    } catch (error) {
        console.error("Assignee Interest Share calculation failed", error);
        return null;
    }
}

export const Assigneeclosingbalance = async (currentsheet, previoussheet, previousmontharray) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];

        await calculationsheet[0].push(`${actualmonth} Assignee Closing Balance`);

        const OBASindex = calculationsheet[0].indexOf(`Opening Balance Assignee Share (90%)`);
        const APSindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Share`);
        const ACBindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Closing Balance`);

        for (let i = 1; i < calculationsheet.length; i++) {
            let OBAS = parseFloat(calculationsheet[i][OBASindex]) || 0;
            let APS = parseFloat(calculationsheet[i][APSindex]) || 0;
            let ACB = OBAS - APS;
            calculationsheet[i][ACBindex] = (ACB).toFixed(2);
        }
        // console.log("Assignee Closing Balance calculation done", calculationsheet);
        return calculationsheet;
    } catch (error) {
        console.error("Assignee Closing Balance calculation failed", error);
        return null;
    }
}

export const AssigneePrincipalOverdue = async (currentsheet, previoussheet, previousmontharray) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];

        await calculationsheet[0].push(`${actualmonth} Assignee Principal Overdue`);


        const closingprincipaloverdueindex = calculationsheet[0].indexOf(`Closing Principal Overdue`);
        const APOindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Overdue`);

        for (let i = 1; i < calculationsheet.length; i++) {
            let closingprincipaloverdue = parseFloat(calculationsheet[i][closingprincipaloverdueindex]) || 0;
            let APO = (closingprincipaloverdue) * 0.90;
            calculationsheet[i][APOindex] = (APO).toFixed(2);
        }
        // console.log("Assignee Principal Overdue calculation done", calculationsheet);
        return calculationsheet;
    } catch (error) {
        console.error("Assignee Principal Overdue calculation failed", error);
        return null;
    }
}


export const AssigneeInterestOverdue = async (currentsheet, previoussheet, previousmontharray) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Overdue`);

            const openingprincipaloverdueindex = calculationsheet[0].indexOf(`Opening Principal Overdue`);
            const OBASindex = calculationsheet[0].indexOf(`Opening Balance Assignee Share (90%)`);
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest");
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            const previouspayoutindex = previoussheet[0].data[0].indexOf("Current Payout Date");
            const correntisr = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const currentinterestindex = calculationsheet[0].indexOf("Current Interest");

            const currentpayoutdate = calculationsheet[2][currentpayoutindex];
            const previouspayoutdate = previoussheet[0].data[1][previouspayoutindex];

            const date = await calculateDays(previouspayoutdate, currentpayoutdate);

            const AISindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Share`);
            const AIOindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Overdue`);

            for (let i = 1; i < calculationsheet.length; i++) {
                let openingprincipaloverdue = parseFloat(calculationsheet[i][openingprincipaloverdueindex]) || 0;
                let OBAS = parseFloat(calculationsheet[i][OBASindex]) || 0;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let currisr = parseFloat(calculationsheet[i][correntisr]) || 0;
                let currentinterest = parseFloat(calculationsheet[i][currentinterestindex]) || 0;
                let curisrvalue = currisr / 100;
                let ROIvalue = ROI / 100;
                let AIO = (OBAS - (openingprincipaloverdue * 0.90) * ROIvalue * (date / 365)) - (curisrvalue * currentinterest);
                calculationsheet[i][AIOindex] = (AIO).toFixed(2);
            }
            // console.log("Assignee Interest Overdue calculation done", calculationsheet);
            return calculationsheet;
        } else {

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Overdue`);

            const OBASindex = calculationsheet[0].indexOf(`Opening Balance Assignee Share (90%)`);
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest");
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            const previouspayoutindex = calculationsheet[0].indexOf("Date of Disbursement");
            const correntisr = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const currentinterestindex = calculationsheet[0].indexOf("Current Interest");

            const currentpayoutdate = calculationsheet[2][currentpayoutindex];
            const previouspayoutdate = calculationsheet[2][previouspayoutindex];

            const date = await calculateDays(previouspayoutdate, currentpayoutdate);

            const AIOindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Overdue`);

            for (let i = 1; i < calculationsheet.length; i++) {
                let OBAS = parseFloat(calculationsheet[i][OBASindex]) || 0;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let currisr = parseFloat(calculationsheet[i][correntisr]) || 0;
                let currentinterest = parseFloat(calculationsheet[i][currentinterestindex]) || 0;
                let curisrvalue = currisr / 100;
                let ROIvalue = ROI / 100;
                let AIO = (OBAS - ROIvalue * (date / 365)) + (curisrvalue * currentinterest);
                calculationsheet[i][AIOindex] = (AIO).toFixed(2);
            }
            // console.log("Assignee Interest Over")
            return calculationsheet;


        }
    } catch (error) {
        console.error("Assignee Interest Overdue calculation failed", error);
        return null;
    }
}

