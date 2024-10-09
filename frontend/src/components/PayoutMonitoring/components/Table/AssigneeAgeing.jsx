import React from "react";
import { FaLock } from "react-icons/fa";

const AssignorAgeing = ({ data }) => {
  // Local formatNumber function
  const formatNumber = (number) => {
    if (typeof number === "string") return number; // Handle string cases like "0.02CR"
    if (number === null || number === undefined) return "0.00";
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Predefined sorting order for 'finalNpa'
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

  // Check if data is available
  const hasData = !!data && data.npaMetrics && data.npaMetrics.length > 0;

  // Generate and sort rows based on npaMetrics data
  const rows = data?.npaMetrics
    ?.map((item) => ({
      particular: item.finalNpa,
      values: [
        formatNumber(item.count), // Number of customers
        formatNumber(item.assigneeClosingBalanceSum), // POS Incl Overdue
        formatNumber(item.assigneePrincipalOverdueSum), // Principal Overdue
        formatNumber(item.assigneeInterestOverdueSum), // Interest Overdue
      ],
    }))
    .sort(
      (a, b) =>
        finalNpaOrder.indexOf(a.particular) -
        finalNpaOrder.indexOf(b.particular)
    );

  return (
    <div className="transition-all duration-300 ease-in-out hover:-translate-y-2 relative rounded-xl p-2 bg-white shadow-lg overflow-hidden mb-4">
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

      {/* No Data Message with Transition */}
      <div
        className={`absolute inset-0 bg-gray-100 bg-opacity-20 backdrop-blur-sm flex items-center gap-3 justify-center transition-opacity duration-500 ease-in-out ${hasData ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <FaLock size={20} className="text-orange-400" />
        <span className="text-gray-500 text-lg">
          Not enough data to display
        </span>
      </div>

      <h2 className="text-xl font-semibold text-orange-500 mb-4">
        {`${data?.settings?.assignees} (${data?.settings?.assigneeShare}%) - Ageing`}
      </h2>

      {/* Table */}
      {hasData && (
        <div className="overflow-hidden rounded-xl">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-sm bg-gradient-to-r from-orange-100 to-gray-100 text-gray-700 border-b-2 border-orange-200">
                <th className="p-2 text-left">Particular</th>
                <th className="p-2 text-right">No. Of Customer</th>
                <th className="p-2 text-right">POS Incl Overdue</th>
                <th className="p-2 text-right">Principal Overdue</th>
                <th className="p-2 text-right">Interest Overdue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className={`text-sm text-gray-600 border-t border-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors ${row.isTotalRow ? "font-semibold" : ""
                    }`}
                >
                  <td className="p-2 text-left">{row.particular}</td>
                  <td className="p-2 text-right">{row.values[0]}</td>
                  <td className="p-2 text-right">{row.values[1]}</td>
                  <td className="p-2 text-right">{row.values[2]}</td>
                  <td className="p-2 text-right">{row.values[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignorAgeing;
