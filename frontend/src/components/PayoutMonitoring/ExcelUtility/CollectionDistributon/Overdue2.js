// Helper function to calculate interest and principal overdue
const calculateOverdue = async (sheet, overdueInd, currentInd, billingInd) => {
    try {
        for (let i = 1; i < sheet.length; i++) {
            const currentAmount = parseFloat(sheet[i][currentInd]) || 0;
            const billingAmount = parseFloat(sheet[i][billingInd]) || 0;
            sheet[i][overdueInd] = billingAmount - currentAmount;
        }
    } catch (error) {
        console.log(`Error calculating overdue: ${error.message}`);
    }
};

// Main function to find current interest and principal
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
    OpeningInterestOverdueindex,
    OpeningPrincipalOverdueindex,
    dataofprevious,
    monthsarray,
) => {
    if (!sheet) {
        return { message: "No file selected" };
    }

    const processSheetRow = (row) => {
        let collection = parseFloat(row[netcollectionindex]) || 0;
        let previosprincipal = parseFloat(row[OpeningPrincipalOverdueindex]) || 0;
        let previosinterest = parseFloat(row[OpeningInterestOverdueindex]) || 0;

        // Handle previous months' overdue interest and principal
        if (collection >= previosinterest) {
            collection -= previosinterest;
            previosinterest = 0;
        } else {
            previosinterest -= collection;
            collection = 0;
        }

        if (collection >= previosprincipal) {
            collection -= previosprincipal;
            previosprincipal = 0;
        } else {
            previosprincipal -= collection;
            collection = 0;
        }

        // Process current month's interest
        const billingInterest = parseFloat(row[billinginterestindex]) || 0;
        const currentInterest = Math.min(collection, billingInterest);
        row[currentinterestindex] = currentInterest;
        const currentInterestOverdue = billingInterest - currentInterest + previosinterest;
        row[intrestoverdueindex] = currentInterestOverdue;
        collection -= currentInterest;

        // Process current month's principal
        const billingPrincipal = parseFloat(row[billingPrincipalindex]) || 0;
        const currentPrincipal = Math.min(collection, billingPrincipal);
        row[currentPrincipalindex] = currentPrincipal;
        const currentPrincipalOverdue = billingPrincipal - currentPrincipal + previosprincipal;
        row[Principaloverdueindex] = currentPrincipalOverdue;
        collection -= currentPrincipal;

        // Update remaining collection
        row[remainingPrincipalindex] = collection;
    };

    try {
        // console.log("previousdta", dataofprevious)
        for (let i = 1; i < sheet.length; i++) {
            if (dataofprevious.length > 0) {
                processSheetRow(sheet[i]);
            } else {
                let collection = parseFloat(sheet[i][netcollectionindex]) || 0;
                const billinginterest = parseFloat(sheet[i][billinginterestindex]) || 0;
                const billingPrincipal = parseFloat(sheet[i][billingPrincipalindex]) || 0;

                // Handle current interest and principal
                const currentInterest = Math.min(collection, billinginterest);
                sheet[i][currentinterestindex] = currentInterest;
                sheet[i][intrestoverdueindex] = billinginterest - currentInterest;
                collection -= currentInterest;

                const currentPrincipal = Math.min(collection, billingPrincipal);
                sheet[i][currentPrincipalindex] = currentPrincipal;
                sheet[i][Principaloverdueindex] = billingPrincipal - currentPrincipal;
                collection -= currentPrincipal;

                sheet[i][remainingPrincipalindex] = collection;
            }
        }

        // Calculate overdue amounts for all rows
        await calculateOverdue(sheet, intrestoverdueindex, currentinterestindex, billinginterestindex);
        await calculateOverdue(sheet, Principaloverdueindex, currentPrincipalindex, billingPrincipalindex);

        return sheet;
    } catch (error) {
        console.log(error)
        console.log(`Error processing interest and principal: ${error.message}`);
    }
};
