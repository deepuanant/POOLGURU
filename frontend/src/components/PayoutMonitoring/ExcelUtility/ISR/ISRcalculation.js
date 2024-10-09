import { current } from "@reduxjs/toolkit";



async function calculateDays(date1Str, date2Str) {
    // Helper function to check if a year is a leap year
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Convert the string dates to Date objects
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    // Calculate the difference in milliseconds
    const differenceInTime = date2.getTime() - date1.getTime();

    // Convert milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Check if date1 and date2 are in leap years
    const isDate1LeapYear = isLeapYear(date1.getFullYear());
    const isDate2LeapYear = isLeapYear(date2.getFullYear());

    // Return both the difference in days and leap year status
    return {
        differenceInDays,
        isDate1LeapYear,
        isDate2LeapYear
    };
}


//  Current Month Assignee ISR calculation

export const Isrcalculation = async (currentsheet, previoussheet, previousmontharray, setting) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            const previousmonth = previousmontharray[0];

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            const assigneeshareper = (setting.assigneeShare) / 100;

            await calculationsheet[0].push(`${actualmonth} Assignee ISR`);

            const OPindex = calculationsheet[0].indexOf("Opening POS (Incl Principle Overdue) (100%)");
            // const PMPOindex = previoussheet[0].data[0].indexOf(`${previousmonth} Principal Overdue`);
            const PMPOindex = calculationsheet[0].indexOf(`Overdue Principal`);

            const ROIindex = calculationsheet[0].indexOf("Rate of Interest")
            const openoverdueprinindex = calculationsheet[0].indexOf("Opening Principal Overdue");
            const ISRindex = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const lastpayoutindex = previoussheet[0].data[0].indexOf("Current Payout Date");
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            const billingintindex = calculationsheet[0].indexOf("Billing Interest");

            const lastpayoutdate = previoussheet[0].data[1][lastpayoutindex];
            const currentpayoutdate = calculationsheet[2][currentpayoutindex];


            const response = await calculateDays(lastpayoutdate, currentpayoutdate);
            const days = response.differenceInDays;
            let numberofdays;
            if (response.isDate1LeapYear) {
                numberofdays = 366;
            } else {
                numberofdays = 365;
            }





            for (let i = 1; i < calculationsheet.length; i++) {
                let OP = (calculationsheet[i][OPindex]) || 0;
                if (typeof OP === 'string') {
                    OP = parseFloat(OP.replace(/,/g, ''));
                }
                let Opvalue = OP * assigneeshareper;
                let PMPO = parseFloat(calculationsheet[i][PMPOindex]) || 0;
                let openingoverdueprin = parseFloat(calculationsheet[i][openoverdueprinindex]) || 0;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let billingint = (calculationsheet[i][billingintindex]) || 0;
                if (typeof billingint === 'string') {
                    billingint = parseFloat(billingint.replace(/,/g, ''));
                }

                // enable noofdays according to leap year (parameter input) later after calculation is done
                let ISR = ((Opvalue - (openingoverdueprin * assigneeshareper)) * (ROI / 100) * (days / 365)) / billingint;

                calculationsheet[i][ISRindex] = `${(ISR * 100).toFixed(2)}%`;
            }
            return calculationsheet;




        }
        else {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            const assigneeshareper = (setting.assigneeShare) / 100;

            await calculationsheet[0].push(`${actualmonth} Assignee ISR`);
            const OPindex = calculationsheet[0].indexOf("Opening POS (Incl Principle Overdue) (100%)");
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest")
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            // const lastpayoutindex = calculationsheet[0].indexOf("Date of Disbursement");
            // const lastpayoutdate = calculationsheet[2][lastpayoutindex];
            const lastpayoutdate = setting.dateofDisbursement;
            const currentpayoutdate = calculationsheet[2][currentpayoutindex];
            const billingintindex = calculationsheet[0].indexOf("Billing Interest");
            const openoverdueprinindex = calculationsheet[0].indexOf("Opening Principal Overdue");


            const response = await calculateDays(lastpayoutdate, currentpayoutdate);
            const days = response.differenceInDays;
            // console.log("number of days for april month", days);
            let numberofdays;
            if (response.isDate1LeapYear) {
                numberofdays = 366;
            } else {
                numberofdays = 365;
            }





            const ISRindex = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);


            for (let i = 1; i < calculationsheet.length; i++) {
                let OP = (calculationsheet[i][OPindex]) || 0;
                if (typeof OP === 'string') {
                    OP = parseFloat(OP.replace(/,/g, ''));
                }
                let OPvalue = OP * assigneeshareper;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let billingint = (calculationsheet[i][billingintindex]) || 0;
                let openingoverdueprin = parseFloat(calculationsheet[i][openoverdueprinindex]) || 0;
                if (typeof billingint === 'string') {
                    billingint = parseFloat(billingint.replace(/,/g, ''));
                }
                // enable later after calculation is done
                // let ISR = ((OBAS) * (ROI / 100) * (days / numberofdays)) / billingint;
                let ISR = ((OPvalue - (openingoverdueprin * assigneeshareper)) * (ROI / 100) * (days / 366)) / billingint;

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

export const AssigneePrincipalShare = async (currentsheet, previoussheet, previousmontharray, setting) => {

    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            const previousmonth = previousmontharray[0];

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            const Assigneeshareper = (setting.assigneeShare) / 100;


            await calculationsheet[0].push(`${actualmonth} Assignee Principal Share`);

            const sumprevPrincipalOverdue = async (sheet, index, monthsarray) => {
                let sum = 0;

                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let principaloverdueindex = sheet[0].indexOf(`${month} Principal Overdue`);
                    let principaloverdue = parseFloat(sheet[index][principaloverdueindex]) || 0;
                    sum += principaloverdue;
                }
                return sum;
            }

            const sumprincipaloverdue = async (sheet, index, monthsarray) => {
                let sum = 0;
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let principaloverdueindex = sheet[0].indexOf(`${month} Principal Overdue`);
                    let principaloverdue = parseFloat(sheet[index][principaloverdueindex]) || 0;
                    sum += principaloverdue;
                }
                return sum;
            }




            const billingprepayindex = calculationsheet[0].indexOf("Billing Prepayment");
            const CurrentPrincipalindex = calculationsheet[0].indexOf("Current Principal");
            const APSindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Share`);


            for (let i = 1; i < calculationsheet.length; i++) {
                let billingprepay = (calculationsheet[i][billingprepayindex]) || 0;
                if (typeof billingprepay === 'string') {
                    billingprepay = parseFloat(billingprepay.replace(/,/g, ''));
                }

                let currentPrincipal = parseFloat(calculationsheet[i][CurrentPrincipalindex]) || 0;
                let sum = await sumprevPrincipalOverdue(previoussheet[0].data, i, previousmontharray);
                let sum2 = await sumprincipaloverdue(calculationsheet, i, previousmontharray);
                let actual = sum2 - sum;
                actual = Math.abs(actual);

                let APSR = (actual + billingprepay + currentPrincipal) * Assigneeshareper;
                calculationsheet[i][APSindex] = APSR;
            }
            return calculationsheet;


        }
        else {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            const Assigneeshareper = (setting.assigneeShare) / 100;


            await calculationsheet[0].push(`${actualmonth} Assignee Principal Share`);

            const APSindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Share`);
            const billingprepayindex = calculationsheet[0].indexOf("Billing Prepayment");
            const CurrentPrincipalindex = calculationsheet[0].indexOf("Current Principal");



            for (let i = 1; i < calculationsheet.length; i++) {
                let billingprepay = (calculationsheet[i][billingprepayindex]) || 0;
                if (typeof billingprepay === 'string') {
                    billingprepay = parseFloat(billingprepay.replace(/,/g, ''));
                }
                let currentPrincipal = parseFloat(calculationsheet[i][CurrentPrincipalindex]) || 0;
                let APSR = (billingprepay + currentPrincipal) * Assigneeshareper;
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
            const previousmonth = previousmontharray[0];

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));

            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Share`);

            const sumPrevInterestshare = async (sheet, original, index, monthsarray) => {
                let sum = 0;

                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];

                    let previsrindex = sheet[0].indexOf(`${month} Assignee ISR`);
                    let currentintindex = original[0].indexOf(`${month} Interest Overdue`);
                    let previsrinpercent = parseFloat(sheet[index][previsrindex]) || 0;
                    let previsr = previsrinpercent / 100;
                    let previntrestoverdueindex = sheet[0].indexOf(`${month} Interest Overdue`);
                    let previntrestoverdue = parseFloat(sheet[index][previntrestoverdueindex]) || 0;
                    let currentintrestoverdue = parseFloat(original[index][currentintindex]) || 0;
                    let diff = previntrestoverdue - currentintrestoverdue;
                    sum += (previsr * diff);
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
                let sum = await sumPrevInterestshare(previoussheet[0].data, calculationsheet, i, previousmontharray);
                let AISR = (currisrpercent * currintrest) + sum;
                let AISRvalue = parseFloat(AISR.toFixed(2));
                calculationsheet[i][AISindex] = AISRvalue;
            }

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
                let AISRvalue = parseFloat(AISR.toFixed(2));
                calculationsheet[i][AISindex] = AISRvalue;
            }
            return calculationsheet;
        }

    } catch (error) {
        console.error("Assignee Interest Share calculation failed", error);
        return null;
    }
}

export const Assigneeclosingbalance = async (currentsheet, previoussheet, previousmontharray, setting) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        const assigneeshareper = (setting.assigneeShare) / 100;

        await calculationsheet[0].push(`${actualmonth} Assignee Closing Balance`);

        const OPindex = calculationsheet[0].indexOf(`Opening POS (Incl Principle Overdue) (100%)`);
        const APSindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Share`);
        const ACBindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Closing Balance`);

        for (let i = 1; i < calculationsheet.length; i++) {
            let OP = (calculationsheet[i][OPindex]) || 0;
            if (typeof OP === 'string') {
                OP = parseFloat(OP.replace(/,/g, ''));
            }
            let OPvalue = OP * assigneeshareper;
            let APS = parseFloat(calculationsheet[i][APSindex]) || 0;
            let ACB = OPvalue - APS;
            let ACBvalue = parseFloat(ACB.toFixed(2));
            calculationsheet[i][ACBindex] = ACBvalue;
        }
        return calculationsheet;
    } catch (error) {
        console.error("Assignee Closing Balance calculation failed", error);
        return null;
    }
}

export const AssigneePrincipalOverdue = async (currentsheet, previoussheet, previousmontharray, setting) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        const Assigneeshareper = setting.assigneeShare / 100;

        await calculationsheet[0].push(`${actualmonth} Assignee Principal Overdue`);

        const sumPrincipalOverdue = async (sheet, index, monthsarray) => {
            let sum = 0;

            for (let k = monthsarray.length - 1; k >= 0; k--) {
                let month = monthsarray[k];
                let principaloverdueindex = sheet[0].indexOf(`${month} Principal Overdue`);
                let principaloverdue = parseFloat(sheet[index][principaloverdueindex]) || 0;
                sum += principaloverdue;
            }
            return sum;
        }

        const curentprincipalindex = calculationsheet[0].indexOf(`${actualmonth} Principal Overdue`);
        const APOindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Principal Overdue`);

        for (let i = 1; i < calculationsheet.length; i++) {
            let currentprinoverdue = parseFloat(calculationsheet[i][curentprincipalindex]) || 0;
            let sum = await sumPrincipalOverdue(calculationsheet, i, previousmontharray);

            let APO = (sum + currentprinoverdue) * Assigneeshareper;
            let APOvalue = parseFloat(APO.toFixed(2));
            calculationsheet[i][APOindex] = APOvalue;
        }
        return calculationsheet;
    } catch (error) {
        console.error("Assignee Principal Overdue calculation failed", error);
        return null;
    }
}

export const AssigneeInterestOverdue = async (currentsheet, previoussheet, previousmontharray, setting) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            const Assigneeshareper = setting.assigneeShare / 100;

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Overdue`);

            const OPindex = calculationsheet[0].indexOf(`Opening POS (Incl Principle Overdue) (100%)`);
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest");
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            const previouspayoutindex = previoussheet[0].data[0].indexOf("Current Payout Date");
            const correntisr = calculationsheet[0].indexOf(`${actualmonth} Assignee ISR`);
            const currentinterestindex = calculationsheet[0].indexOf("Current Interest");

            const currentpayoutdate = calculationsheet[2][currentpayoutindex];
            const previouspayoutdate = previoussheet[0].data[1][previouspayoutindex];

            const res = await calculateDays(previouspayoutdate, currentpayoutdate);
            const date = res.differenceInDays;


            const sumprevisrxintOverdue = async (sheet, index, monthsarray) => {
                let sum = 0;

                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let intrestoverdueindex = sheet[0].indexOf(`${month} Interest Overdue`);
                    let prevmonthisrindex = sheet[0].indexOf(`${month} Assignee ISR`);
                    let prevmonthisr = parseFloat(sheet[index][prevmonthisrindex]) || 0;
                    let previntrestoverdue = parseFloat(sheet[index][intrestoverdueindex]) || 0;
                    sum += (prevmonthisr / 100) * previntrestoverdue;
                }
                return sum;
            }

            const sumprincipaloverdue = async (sheet, index, monthsarray) => {
                let sum = 0;
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let principaloverdueindex = sheet[0].data[0].indexOf(`${month} Principal Overdue`);
                    let principaloverdue = parseFloat(sheet[0].data[index][principaloverdueindex]) || 0;
                    sum += principaloverdue;
                }
                return sum;
            }

            const overdueprincipal = calculationsheet[0].indexOf(`Overdue Principal`);
            const AISindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Share`);
            const AIOindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Overdue`);

            for (let i = 1; i < calculationsheet.length; i++) {
                let OP = (calculationsheet[i][OPindex]) || 0;
                if (typeof OP === 'string') {
                    OP = parseFloat(OP.replace(/,/g, ''));
                }

                let OPvalue = OP * Assigneeshareper;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let ROIvalue = ROI / 100;
                let sum = await sumprevisrxintOverdue(previoussheet[0].data, i, previousmontharray);
                let AIS = parseFloat(calculationsheet[i][AISindex]) || 0;
                let principaloverduesum = await sumprincipaloverdue(previoussheet, i, previousmontharray);
                let overdueprin = parseFloat(calculationsheet[i][overdueprincipal]) || 0;


                //leap year check after calculation is done
                let AIO = (((OPvalue - (overdueprin * Assigneeshareper)) * ROIvalue * (date / 365)) + sum) - AIS;
                let AIOvalue = parseFloat(AIO.toFixed(2));
                calculationsheet[i][AIOindex] = AIOvalue;
            }
            return calculationsheet;
        } else {

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            const Assigneeshareper = setting.assigneeShare / 100;

            await calculationsheet[0].push(`${actualmonth} Assignee Interest Overdue`);

            const OPindex = calculationsheet[0].indexOf(`Opening POS (Incl Principle Overdue) (100%)`);
            const ROIindex = calculationsheet[0].indexOf("Rate of Interest");
            const currentpayoutindex = calculationsheet[0].indexOf("Current Payout Date");
            // const previouspayoutindex = calculationsheet[0].indexOf("Date of Disbursement");
            const AIS = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Share`);

            const currentpayoutdate = calculationsheet[2][currentpayoutindex];
            // const previouspayoutdate = calculationsheet[2][previouspayoutindex];
            const previouspayoutdate = setting.dateofDisbursement;

            const dategot = await calculateDays(previouspayoutdate, currentpayoutdate);
            const date = dategot.differenceInDays;

            const AIOindex = calculationsheet[0].indexOf(`${actualmonth} Assignee Interest Overdue`);

            for (let i = 1; i < calculationsheet.length; i++) {
                let OP = (calculationsheet[i][OPindex]) || 0;
                if (typeof OP === 'string') {
                    OP = parseFloat(OP.replace(/,/g, ''));
                }

                let OPvalue = OP * Assigneeshareper;
                let ROI = parseFloat(calculationsheet[i][ROIindex]) || 0;
                let AISR = parseFloat(calculationsheet[i][AIS]) || 0;
                let ROIvalue = ROI / 100;
                let AIO = ((OPvalue) * ROIvalue * (date / 365)) - AISR;
                let AIOvalue = parseFloat(AIO.toFixed(2));
                calculationsheet[i][AIOindex] = AIOvalue;
            }
            return calculationsheet;


        }
    } catch (error) {
        console.error("Assignee Interest Overdue calculation failed", error);
        return null;
    }
}


export const closingbalance = async (currentsheet) => {

    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        await calculationsheet[0].push(`Closing Balance`);
        const closingindex = calculationsheet[0].indexOf(`Closing Balance`);
        const OPOSindex = calculationsheet[0].indexOf("Opening POS (Incl Principle Overdue) (100%)");
        const overdueindex = calculationsheet[0].indexOf("Overdue Principal");
        const currentprincipalindex = calculationsheet[0].indexOf("Current Principal");
        const prepaymentindex = calculationsheet[0].indexOf("Prepayment");


        for (let i = 1; i < calculationsheet.length; i++) {
            let OPOS = (calculationsheet[i][OPOSindex]) || 0;
            if (typeof OPOS === 'string') {
                OPOS = parseFloat(OPOS.replace(/,/g, ''));
            }
            let prepayment = calculationsheet[i][prepaymentindex] || 0;
            let overdue = parseFloat(calculationsheet[i][overdueindex]) || 0;
            let currentprincipal = parseFloat(calculationsheet[i][currentprincipalindex]) || 0;
            let closingbalance = OPOS - (overdue + currentprincipal + prepayment);
            let closingbalancevalue = parseFloat(closingbalance.toFixed(2));
            calculationsheet[i][closingindex] = closingbalancevalue;
        }
        return calculationsheet;

    } catch (error) {
        console.error("Closing Balance calculation failed", error);
        return null;
    }
}

export const advance = async (currentsheet) => {
    try {

        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        await calculationsheet[0].push(`Advance`);
        const advanceindex = calculationsheet[0].indexOf(`Advance`);

        for (let i = 1; i < calculationsheet.length; i++) {
            let advance = 0;
            calculationsheet[i][advanceindex] = advance;
        }

        return calculationsheet;

    } catch (error) {
        console.error("Advance calculation failed", error);
        return null;
    }
}

export const finalnpaclassification = async (currentsheet, previossheet, previousMonth) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }

        const getvalue = async (value) => {
            if (value === "0-0") {
                return "No-Overdue";
            }
            else if (value === "1-30") {
                return "SMA-0"
            }
            else if (value === "31-60") {
                return "SMA-1"
            }
            else if (value === "61-90") {
                return "SMA-2"
            }
            else if (value === "91-456") {
                return "Sub-Standard"
            }
            else if (value === "457-822") {
                return "Doubtful-1"
            }
            else if (value === "823-1553") {
                return "Doubtful-2"
            }
            else if (value === "1554-1919") {
                return "Doubtful-3"
            }
            else if (value === "1919") {
                return "Loss"
            }
            else {
                return "NA"
            }
        }


        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        await calculationsheet[0].push(`Final NPA`);
        const npaindex = calculationsheet[0].indexOf(`Final NPA`);
        const arrearindex = calculationsheet[0].indexOf(`Arrear Days`);
        for (let i = 1; i < calculationsheet.length; i++) {
            let arrearvalue = calculationsheet[i][arrearindex];
            let arrearstring = arrearvalue.toString();
            let value = await getvalue(arrearstring);
            calculationsheet[i][npaindex] = value;
        }
        return calculationsheet;
    } catch (error) {
        console.error("Arreardays calculation failed", error);
        return null;
    }
}

export const CurrentmonthNPA = async (currentsheet) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        await calculationsheet[0].push(`Current Month NPA`);
        const npaindex = calculationsheet[0].indexOf(`Current Month NPA`);
        const dpdindex = calculationsheet[0].indexOf(`DPD Days`);
        const checkdata = async (value) => {
            if (value === 0) {
                return "0-0";
            }
            else if (value > 0 && value <= 30) {
                return "1-30";
            }
            else if (value > 30 && value <= 60) {
                return "31-60";
            }
            else if (value > 60 && value <= 90) {
                return "61-90";
            }
            else if (value > 90 && value <= 456) {
                return "91-456";
            }
            else if (value > 456 && value <= 822) {
                return "457-822";
            }
            else if (value > 822 && value <= 1553) {
                return "823-1553";
            }
            else if (value > 1553 && value <= 1919) {
                return "1554-1919";
            } else {
                return "1919";
            }
        }

        for (let i = 1; i < calculationsheet.length; i++) {
            let valueofdpd = parseInt(calculationsheet[i][dpdindex]) || 0;
            let npa = await checkdata(valueofdpd);
            calculationsheet[i][npaindex] = npa;
        }
        return calculationsheet; s
    } catch (error) {
        console.error("CurrentmonthNPA calculation failed", error);
        return null;
    }
}

export const prevmonthNPA = async (currentsheet, previoussheet, previousMonth) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        if (previoussheet.length > 0) {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            await calculationsheet[0].push(`Previous Month NPA`);
            const npaindex = calculationsheet[0].indexOf(`Previous Month NPA`);
            const prevnpaindex = previoussheet[0].data[0].indexOf(`Current Month NPA`);
            for (let i = 1; i < previoussheet[0].data.length; i++) {
                calculationsheet[i][npaindex] = previoussheet[0].data[i][prevnpaindex];
            }
            return calculationsheet;
        } else {
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            await calculationsheet[0].push(`Previous Month NPA`);
            const npaindex = calculationsheet[0].indexOf(`Previous Month NPA`);
            for (let i = 1; i < calculationsheet.length; i++) {
                calculationsheet[i][npaindex] = "0-0";
            }
            return calculationsheet;

        }
    } catch (error) {
        console.error("prevmonthNPA calculation failed", error);
        return null;
    }
}

export const Arreardays = async (currentsheet, previossheet, previousMonth) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }

        const getvalue = async (value) => {
            if (value === 0) {
                return "0-0";
            }
            else if (value === 1) {
                return "1-30";
            }
            else if (value === 2) {
                return "31-60";
            }
            else if (value === 3) {
                return "61-90";
            }
            else if (value === 4) {
                return "91-456";
            }
            else if (value === 5) {
                return "457-822";
            }
            else if (value === 6) {
                return "823-1553";
            }
            else if (value === 7) {
                return "1554-1919";
            }
            else if (value === 8) {
                return "1919";
            }
            else {
                return "NA";
            }
        }
        if (previossheet.length > 0) {
            // console.log("previousMonth", previousMonth)

            const getnumberofpending = async (calculationsheet, previousMonth, index) => {
                let count = 0;
                for (let i = 0; i < previousMonth.length; i++) {
                    let month = previousMonth[i];

                    // Find the column index for Principal Overdue of the given month
                    let principaloverdueindex = calculationsheet[0].indexOf(`${month} Principal Overdue`);

                    // Ensure that the column exists
                    if (principaloverdueindex === -1) {
                        console.warn(`Column for ${month} Principal Overdue not found`);
                        continue; // Skip if the column is not found
                    }

                    // Retrieve the value and parse it as a float
                    let principalvalue = parseFloat(calculationsheet[index][principaloverdueindex]);

                    // Check if the value is valid, and count the number of months with overdue principal
                    if (!isNaN(principalvalue) && principalvalue > 0) {
                        count++; // Increase the count if overdue exists
                    } else {
                        break; // Stop the loop if there is no overdue for this month
                    }
                }

                return count;
            };
            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            let copyofpreviousmonth = JSON.parse(JSON.stringify(previousMonth));
            await copyofpreviousmonth.reverse();
            await copyofpreviousmonth.push(actualmonth);
            await copyofpreviousmonth.reverse();
            // console.log("copyofpreviousmonth", copyofpreviousmonth)
            await calculationsheet[0].push(`Arrear Days`);
            const arrearindex = calculationsheet[0].indexOf(`Arrear Days`);
            for (let i = 1; i < calculationsheet.length; i++) {
                let numberofmonthpending = await getnumberofpending(calculationsheet, copyofpreviousmonth, i);
                let value = await getvalue(numberofmonthpending);
                calculationsheet[i][arrearindex] = value;
            }
            return calculationsheet;
        } else {

            const getnumberofpending = async (calculationsheet, currmonth, index) => {

                // Find the column index for Principal Overdue of the given month
                let principaloverdueindex = calculationsheet[0].indexOf(`${currmonth} Principal Overdue`);
                // Retrieve the value and parse it as a float
                let principalvalue = parseFloat(calculationsheet[index][principaloverdueindex]);
                if (principalvalue > 0) {
                    return 1;
                }
                else {
                    return 0;
                }

            };

            let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            await calculationsheet[0].push(`Arrear Days`);
            const arrearindex = calculationsheet[0].indexOf(`Arrear Days`);
            for (let i = 1; i < calculationsheet.length; i++) {
                let numberofmonthpending = await getnumberofpending(calculationsheet, actualmonth, i);
                let value = await getvalue(numberofmonthpending);
                calculationsheet[i][arrearindex] = value;
            }

            return calculationsheet;

        }
    } catch (error) {
        console.error("finalnpaclassification calculation failed", error);
        return null;
    }
};



