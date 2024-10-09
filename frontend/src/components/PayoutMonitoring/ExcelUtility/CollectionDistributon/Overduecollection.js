
// This file contains functions to calculate overdue interest and principal for each month in the sheet
// The functions are used in the main function findcurrentInterest to calculate the current interest and principal
const calculateintrestoverdue = (sheet, interestoverdueind, CurrentInterestind, billingInterestind) => {
    try {
        for (let i = 1; i < sheet.length; i++) {
            let currentinterest = parseFloat(sheet[i][CurrentInterestind]) || 0;
            let billinginterest = parseFloat(sheet[i][billingInterestind]) || 0;
            sheet[i][interestoverdueind] = billinginterest - currentinterest;
        }
        return sheet;
    } catch (error) {
        console.log("Error in finding interest overdue", error);
    }
}
// Calculate the principal overdue for each month in the sheet
const calculatePrincipaloverdue = (sheet, Principaloverdueind, CurrentPrincipalind, billingPrincipalind) => {
    try {
        for (let i = 1; i < sheet.length; i++) {
            let currentPrincipal = parseFloat(sheet[i][CurrentPrincipalind]) || 0;
            let billingPrincipal = parseFloat(sheet[i][billingPrincipalind]) || 0;
            sheet[i][Principaloverdueind] = billingPrincipal - currentPrincipal;
        }
        return sheet;
    } catch (error) {
        console.log("Error in finding Principal overdue", error);
    }
}
//
export const findcurrentInterest = async (
    sheet,
    netcollectionindex,
    currentinterestindex,
    currmonth,
    billinginterestindex,
    billingPrincipalindex,
    currentPrincipalindex,
    remainingPrincipalindex,
    intrestoverdueindex,
    Principaloverdueindex,
    dataofprevious,
    monthsarray
) => {
    if (!sheet) {
        return { message: "No file selected" };
    }

    if (dataofprevious.length > 0) {
        try {
            for (let i = 1; i < sheet.length; i++) {
                let collection = parseFloat(sheet[i][netcollectionindex]) || 0;

                // Handle previous months' overdue interest and principal
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    const month = monthsarray[k];

                    // Interest Overdue for previous month
                    const intOverdueIndex = sheet[0].indexOf(`${month} Interest Overdue`);
                    let interestOverdue = parseFloat(sheet[i][intOverdueIndex]) || 0;



                    if (collection > 0 && interestOverdue > 0) {
                        if (collection >= interestOverdue) {
                            collection -= interestOverdue;
                            interestOverdue = 0;
                        } else {
                            interestOverdue -= collection;
                            collection = 0;
                        }
                    }

                    // Principal Overdue for previous month
                    const prinOverdueIndex = sheet[0].indexOf(`${month} Principal Overdue`);
                    let principalOverdue = parseFloat(sheet[i][prinOverdueIndex]) || 0;


                    if (collection > 0 && principalOverdue > 0) {
                        if (collection >= principalOverdue) {
                            collection -= principalOverdue;
                            principalOverdue = 0;
                        } else {
                            principalOverdue -= collection;
                            collection = 0;
                        }
                    }
                    // Update the overdue values for previous months in the sheet
                    sheet[i][intOverdueIndex] = interestOverdue;
                    sheet[i][prinOverdueIndex] = principalOverdue;
                }

                // Process the current month's interest
                let billingInterest = (sheet[i][billinginterestindex]) || 0;
                if (typeof billingInterest === 'string') {
                    billingInterest = parseFloat(billingInterest.replace(/,/g, '')) || 0;
                }
                let currentInterest = 0;
                if (collection > 0 && billingInterest > 0) {
                    if (collection >= billingInterest) {
                        currentInterest = billingInterest;
                        collection -= billingInterest;
                    } else {
                        currentInterest = collection;
                        collection = 0;
                    }
                }
                sheet[i][currentinterestindex] = currentInterest;

                // Calculate the current month's interest overdue if not fully paid
                const currentInterestOverdue = billingInterest - currentInterest;
                sheet[i][intrestoverdueindex] = currentInterestOverdue; // Do not add previous overdue, just use the current month's overdue

                // Process the current month's principal
                let billingPrincipal = (sheet[i][billingPrincipalindex]) || 0;
                if (typeof billingPrincipal === 'string') {
                    billingPrincipal = parseFloat(billingPrincipal.replace(/,/g, '')) || 0;
                }
                let currentPrincipal = 0;
                if (collection > 0 && billingPrincipal > 0) {
                    if (collection >= billingPrincipal) {
                        currentPrincipal = billingPrincipal;
                        collection -= billingPrincipal;
                    } else {
                        currentPrincipal = collection;
                        collection = 0;
                    }
                }
                sheet[i][currentPrincipalindex] = currentPrincipal;

                // Calculate the current month's principal overdue if not fully paid
                const currentPrincipalOverdue = billingPrincipal - currentPrincipal;
                sheet[i][Principaloverdueindex] = currentPrincipalOverdue; // Do not add previous overdue, just use the current month's overdue

                // Update remaining collection
                sheet[i][remainingPrincipalindex] = collection;
            }

            return sheet;
        } catch (error) {
            console.log("Error in processing overdue calculations and current interest", error);
        }
    } else {
        try {
            for (let i = 1; i < sheet.length; i++) {
                let collection = parseFloat(sheet[i][netcollectionindex]) || 0;
                let billinginterest = (sheet[i][billinginterestindex]) || 0;
                if (typeof billinginterest === 'string') {
                    billinginterest = parseFloat(billinginterest.replace(/,/g, '')) || 0;
                }

                let billingPrincipal = (sheet[i][billingPrincipalindex]) || 0;
                if (typeof billingPrincipal === 'string') {
                    billingPrincipal = parseFloat(billingPrincipal.replace(/,/g, '')) || 0;
                }

                // Handle current interest and principal
                let currentInterest = 0;
                if (collection >= billinginterest) {
                    currentInterest = billinginterest;
                    collection -= billinginterest;
                } else {
                    currentInterest = collection;
                    collection = 0;
                }
                sheet[i][currentinterestindex] = currentInterest;

                const currentInterestOverdue = billinginterest - currentInterest;
                sheet[i][intrestoverdueindex] = currentInterestOverdue;

                let currentPrincipal = 0;
                if (collection >= billingPrincipal) {
                    currentPrincipal = billingPrincipal;
                    collection -= billingPrincipal;
                } else {
                    currentPrincipal = collection;
                    collection = 0;
                }
                sheet[i][currentPrincipalindex] = currentPrincipal;

                const currentPrincipalOverdue = billingPrincipal - currentPrincipal;
                sheet[i][Principaloverdueindex] = currentPrincipalOverdue;

                sheet[i][remainingPrincipalindex] = collection;
            }

            // After calculating the current interest and principal, calculate overdue amounts
            await calculateintrestoverdue(sheet, intrestoverdueindex, currentinterestindex, billinginterestindex);
            await calculatePrincipaloverdue(sheet, Principaloverdueindex, currentPrincipalindex, billingPrincipalindex);

            return sheet;
        } catch (error) {
            console.log("Error in finding current interest or calculating overdue amounts", error);
        }
    }
}

export const overdues = async (sheet, previoussheet, previousmonth) => {
    // console.log("in overdue")
    try {
        if (!sheet) {
            return { message: "No file selected" };
        }

        // console.log("previossheet", previoussheet)
        if (previoussheet.length > 0) {
            let calculationsheet = JSON.parse(JSON.stringify(sheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];

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

            const suminterestoverdue = async (sheet, index, monthsarray) => {
                let sum = 0;
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let interestoverdueindex = sheet[0].indexOf(`${month} Interest Overdue`);
                    let interestoverdue = parseFloat(sheet[index][interestoverdueindex]) || 0;
                    sum += interestoverdue;
                }
                return sum;
            }

            const sumprevintrestoverdue = async (sheet, index, monthsarray) => {
                let sum = 0;
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let interestoverdueindex = sheet[0].indexOf(`${month} Interest Overdue`);
                    let interestoverdue = parseFloat(sheet[index][interestoverdueindex]) || 0;
                    sum += interestoverdue;
                }
                return sum;
            }

            const sumcurrentcharges = async (sheet, index, monthsarray) => {
                let sum = 0;
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let currentchargesindex = sheet[0].indexOf(`${month} Current Charges`);
                    let currentcharges = parseFloat(sheet[index][currentchargesindex]) || 0;
                    sum += currentcharges;
                }
                return sum;
            }
            const sumprevcharges = async (sheet, index, monthsarray) => {
                let sum = 0;
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let currentchargesindex = sheet[0].indexOf(`${month} Current Charges`);
                    let currentcharges = parseFloat(sheet[index][currentchargesindex]) || 0;
                    sum += currentcharges;
                }
                return sum;
            }


            await calculationsheet[0].push(`Overdue Charges`, `Overdue Interest`, `Overdue Principal`);
            const overduechargesindex = calculationsheet[0].indexOf(`Overdue Charges`);
            const overdueinterestindex = calculationsheet[0].indexOf(`Overdue Interest`);
            const overdueprincipalindex = calculationsheet[0].indexOf(`Overdue Principal`);

            for (let i = 1; i < calculationsheet.length; i++) {

                let sumprevprinoverdue = await sumprevPrincipalOverdue(previoussheet[0].data, i, previousmonth);
                let sumprevintoverdue = await sumprevintrestoverdue(previoussheet[0].data, i, previousmonth);
                let sumprevch = await sumprevcharges(previoussheet[0].data, i, previousmonth);
                let sumcurrentch = await sumcurrentcharges(calculationsheet, i, previousmonth);
                let sumprincipalover = await sumprincipaloverdue(calculationsheet, i, previousmonth);
                let suminterestover = await suminterestoverdue(calculationsheet, i, previousmonth);
                let principalfinal = sumprincipalover - sumprevprinoverdue;
                principalfinal = Math.abs(principalfinal);
                let interestfinal = suminterestover - sumprevintoverdue;
                interestfinal = Math.abs(interestfinal);
                let chargesfinal = sumcurrentch - sumprevch;
                chargesfinal = Math.abs(chargesfinal);



                calculationsheet[i][overduechargesindex] = chargesfinal;
                calculationsheet[i][overdueinterestindex] = interestfinal;
                calculationsheet[i][overdueprincipalindex] = principalfinal;


            }
            return calculationsheet;


        } else {
            // console.log("in else")
            let calculationsheet = JSON.parse(JSON.stringify(sheet));
            const array = calculationsheet[0];
            const month = array.indexOf("Collection Month");
            const actualmonth = calculationsheet[2][month];
            await calculationsheet[0].push(`Overdue Charges`, `Overdue Interest`, `Overdue Principal`);
            const overduechargesindex = calculationsheet[0].indexOf(`Overdue Charges`);
            const overdueinterestindex = calculationsheet[0].indexOf(`Overdue Interest`);
            const overdueprincipalindex = calculationsheet[0].indexOf(`Overdue Principal`);

            for (let i = 1; i < calculationsheet.length; i++) {

                calculationsheet[i][overduechargesindex] = 0;
                calculationsheet[i][overdueinterestindex] = 0;
                calculationsheet[i][overdueprincipalindex] = 0;


            }

            return calculationsheet;



        }




    } catch (error) {
        console.log("Error in finding overdue", error);

    }
}

export const findclosingoverdues = async (currentsheet, previoussheet, previousmontharray) => {
    try {
        if (!currentsheet) {
            return { message: "No file selected" };
        }
        let calculationsheet = JSON.parse(JSON.stringify(currentsheet));
        const array = calculationsheet[0];
        const month = array.indexOf("Collection Month");
        const actualmonth = calculationsheet[2][month];
        calculationsheet[0].push(`Closing Charge Overdue`, `Closing Interest Overdue`, `Closing Principal Overdue`);
        const intindex = calculationsheet[0].indexOf(`Closing Interest Overdue`);
        const prinindex = calculationsheet[0].indexOf(`Closing Principal Overdue`);
        const chargesindex = calculationsheet[0].indexOf(`Closing Charge Overdue`);


        const sumoverduedue = async (sheet, index, monthsarray, currentmonth, name) => {
            let sum = 0;
            if (monthsarray.length !== 0) {
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    let month = monthsarray[k];
                    let overdueindex = sheet[0].indexOf(`${month} ${name}`);
                    let overdue = parseFloat(sheet[index][overdueindex]) || 0;
                    sum += overdue;
                }
            }
            let curroverdueindex = sheet[0].indexOf(`${currentmonth} ${name}`);
            let curroverdue = parseFloat(sheet[index][curroverdueindex]) || 0;
            sum += curroverdue;

            return sum;
        }


        for (let i = 1; i < calculationsheet.length; i++) {
            let sumprin = await sumoverduedue(calculationsheet, i, previousmontharray, actualmonth, "Principal Overdue");
            let sumint = await sumoverduedue(calculationsheet, i, previousmontharray, actualmonth, "Interest Overdue");
            let sumcharges = await sumoverduedue(calculationsheet, i, previousmontharray, actualmonth, "Charge Overdue");

            calculationsheet[i][intindex] = sumint;
            calculationsheet[i][prinindex] = sumprin;
            calculationsheet[i][chargesindex] = sumcharges;
        }

        return calculationsheet;



    } catch (error) {
        console.log("Error in finding closing overdue", error);
    }
}
