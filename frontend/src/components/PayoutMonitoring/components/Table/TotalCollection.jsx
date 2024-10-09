import React from "react";
import { FaLock } from "react-icons/fa";

// Utility to format numbers
const formatNumber = (number) => {
  if (typeof number === "string") return number; // Handle cases like "0.02CR"
  if (number === null || number === undefined) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

const TotalCollection = ({ data }) => {
  const rows = [
    {
      particular: "Current Billing",
      values: [
        formatNumber(data?.data?.currrentprincipal || 0),
        formatNumber(data?.data?.currentintrest || 0),
        formatNumber(
          (data?.data?.currrentprincipal || 0) + (data?.data?.currentintrest || 0)
        ),
      ],
    },
    {
      particular: "Prepayments",
      values: [
        formatNumber(data?.data?.prepayment || 0),
        "0.00",
        formatNumber(data?.data?.prepayment || 0),
      ],
    },
    {
      particular: "Charges",
      values: [
        formatNumber(data?.data?.currentcharges || 0),
        "0.00",
        formatNumber(data?.data?.currentcharges || 0),
      ],
    },
    {
      particular: "Overdue",
      values: [
        formatNumber(data?.data?.overdueprincipal || 0),
        formatNumber(data?.data?.overdueinterest || 0),
        formatNumber(
          (data?.data?.overdueprincipal || 0) + (data?.data?.overdueinterest || 0)
        ),
      ],
    },
    {
      particular: "Total",
      values: [
        formatNumber(
          (data?.data?.currrentprincipal || 0) +
          (data?.data?.prepayment || 0) +
          (data?.data?.currentcharges || 0) +
          (data?.data?.overdueprincipal || 0)
        ),
        formatNumber(
          (data?.data?.currentintrest || 0) + (data?.data?.overdueinterest || 0)
        ),
        formatNumber(
          (data?.data?.currrentprincipal || 0) +
          (data?.data?.currentintrest || 0) +
          (data?.data?.prepayment || 0) +
          (data?.data?.currentcharges || 0) +
          (data?.data?.overdueprincipal || 0) +
          (data?.data?.overdueinterest || 0)
        ),
      ],
      isTotalRow: true,
    },
  ];

  // Check if data is available
  const hasData = !!data && !!data.data;

  return (
    <div className="transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white rounded-2xl shadow-lg p-2 relative overflow-hidden mb-4">
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

      {/* Table Display */}
      <h2 className="text-xl font-semibold text-orange-500 mb-4">
        Total Collection
      </h2>
      {hasData && (
        <div className="overflow-hidden rounded-xl">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-sm bg-gradient-to-r from-orange-100 to-gray-100 text-gray-700 border-b-2 border-orange-200">
                <th className="p-2 text-left">Particular</th>
                <th className="p-2 text-right">Principal (₹)</th>
                <th className="p-2 text-right">Interest (₹)</th>
                <th className="p-2 text-right">Total (₹)</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TotalCollection;