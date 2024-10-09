export const findnetCollection = async (sheet, collindex, chargeindex, netcollectionindex, chargeoverdueindex, indexcurrentcharges, dataofprevious, monthsarray) => {
    if (dataofprevious.length > 0) {
        try {
            for (let i = 1; i < sheet.length; i++) {
                let collection = (sheet[i][collindex]) || 0;  // Current month's collection
                if (typeof collection === 'string') {
                    collection = parseFloat(collection.replace(/,/g, '')) || 0;
                }
                let totalPreviousCharges = 0;  // Total overdue charges from previous months
                let chargeoverdue = 0;  // To accumulate the final overdue charges

                // First, subtract all the previous months' overdue charges
                for (let k = monthsarray.length - 1; k >= 0; k--) {
                    const month = monthsarray[k];
                    const chrindex = sheet[0].indexOf(`${month} Charge Overdue`);
                    let prevMonthCharges = (sheet[i][chrindex]) || 0;
                    if (typeof prevMonthCharges === 'string') {
                        prevMonthCharges = parseFloat(prevMonthCharges.replace(/,/g, '')) || 0;
                    }

                    if (collection >= prevMonthCharges) {
                        // Fully pay off previous month's charge
                        collection -= prevMonthCharges;
                        prevMonthCharges = 0;
                    } else {
                        // Partially pay previous month's charge
                        prevMonthCharges -= collection;
                        collection = 0;
                    }

                    // Update the overdue charges in the sheet
                    sheet[i][chrindex] = prevMonthCharges;
                    totalPreviousCharges += prevMonthCharges;  // Accumulate total overdue
                }

                // Now deal with the current month's charges
                let currentMonthCharges = (sheet[i][chargeindex]) || 0; // Current month's charges
                if (typeof currentMonthCharges === 'string') {
                    currentMonthCharges = parseFloat(currentMonthCharges.replace(/,/g, '')) || 0;
                }

                if (collection <= currentMonthCharges) {
                    chargeoverdue += currentMonthCharges - collection;  // Remaining current month charge becomes overdue
                    sheet[i][indexcurrentcharges] = collection;  // Fully pay off current month's charges
                    collection = 0;  // All collection used to pay current month's charges
                } else {

                    collection -= currentMonthCharges;  // Subtract current month's charges from the remaining collection
                    sheet[i][indexcurrentcharges] = currentMonthCharges;  // Fully pay off current month's charges
                }

                // Set the net collection, charge overdue, and current charges in the sheet
                sheet[i][netcollectionindex] = collection;  // Whatever is left after subtracting all charges
                sheet[i][chargeoverdueindex] = chargeoverdue;  // Total overdue charges that couldn't be covered by the collection
            }

            return sheet;
        } catch (error) {
            console.log("Error in finding net collection", error);
        }
    } else {
        // No previous month data, so use only the current month for calculations
        try {
            for (let i = 1; i < sheet.length; i++) {
                let collection = (sheet[i][collindex]) || 0;  // Current month's collection
                if (typeof collection === 'string') {
                    collection = parseFloat(collection.replace(/,/g, '')) || 0;
                }

                let charges = (sheet[i][chargeindex]) || 0;   // Current month's charges
                if (typeof charges === 'string') {
                    charges = parseFloat(charges.replace(/,/g, '')) || 0;
                }



                if (collection <= charges) {
                    sheet[i][netcollectionindex] = 0;
                    sheet[i][chargeoverdueindex] = charges - collection;  // The remaining charges that weren't paid
                } else {
                    sheet[i][netcollectionindex] = collection - charges;  // Net collection after paying charges
                    sheet[i][chargeoverdueindex] = 0;  // No overdue charges
                }
                sheet[i][indexcurrentcharges] = charges;  // Current month's charges
            }
            return sheet;
        } catch (error) {
            console.log("Error in finding net collection", error);
        }
    }
};