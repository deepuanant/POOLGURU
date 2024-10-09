export const findnetCollection = async (sheet, collindex, chargeindex, netcollectionindex, chargeoverdueindex, indexcurrentcharges, OpeningChargeOverdueindex, dataofprevious, monthsarray) => {
    try {
        for (let i = 1; i < sheet.length; i++) {
            let collection = parseFloat(sheet[i][collindex]) || 0; // Current month's collection
            let currentMonthCharges = parseFloat(sheet[i][chargeindex]) || 0; // Current month's charges

            // Initialize overdue charges and previous charges
            let totalPreviousCharges = dataofprevious.length > 0 ? parseFloat(sheet[i][OpeningChargeOverdueindex]) || 0 : 0;
            let chargeoverdue = 0;

            if (dataofprevious.length > 0) {
                // Adjust collection with previous overdue charges
                if (collection >= totalPreviousCharges) {
                    collection -= totalPreviousCharges;
                    totalPreviousCharges = 0;
                } else {
                    totalPreviousCharges -= collection;
                    collection = 0;
                }
            }

            // Adjust collection with current month's charges
            if (collection >= currentMonthCharges) {
                sheet[i][indexcurrentcharges] = currentMonthCharges;
                collection -= currentMonthCharges;
                chargeoverdue = 0;
            } else {
                sheet[i][indexcurrentcharges] = collection;
                chargeoverdue = currentMonthCharges - collection;
                collection = 0;
            }

            // Set the net collection and overdue charges
            sheet[i][netcollectionindex] = collection; // Remaining collection after charges
            sheet[i][chargeoverdueindex] = chargeoverdue + totalPreviousCharges; // Remaining overdue charges
        }
        return sheet;
    } catch (error) {
        console.log("Error in finding net collection", error);
    }
};
