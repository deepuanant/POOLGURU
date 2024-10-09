import React from "react";
import { FaLock } from "react-icons/fa";

const formatNumber = (number) => {
  if (number === null || number === undefined) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Function to get first and last day based on month string (e.g. "Apr-24")
const getFirstAndLastDay = (monthString) => {
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const [monthAbbr, year] = monthString.split("-");
  const monthNumber = monthMap[monthAbbr];

  const firstDay = new Date(`20${year}`, monthNumber, 1);
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-IN", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  };
};

const PrincipalSummary = ({ data }) => {
  const month = data?.month || "N/A";
  const { firstDay, lastDay } =
    month !== "N/A"
      ? getFirstAndLastDay(month)
      : { firstDay: "N/A", lastDay: "N/A" };

  const rows = [
    {
      particular: `Opening Balance as on (${firstDay})`,
      values: [
        formatNumber(data?.data?.assigneeOpening || 0),
        formatNumber(data?.data?.assignorOpening || 0),
        formatNumber(data?.data?.openingBalance || 0),
      ],
    },
    {
      particular: "Principal Collection",
      values: [
        formatNumber(
          data?.data?.totalprincipalcollection *
          (data?.settings?.assigneeShare / 100) || 0
        ),
        formatNumber(
          data?.data?.totalprincipalcollection *
          (data?.settings?.assignorShare / 100) || 0
        ),
        formatNumber(data?.data?.totalprincipalcollection || 0),
      ],
    },
  ];

  // Check if data is available
  const hasData = !!data && !!data.data;

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
        Principal Summary
      </h2>

      {/* Table */}
      {hasData && (
        <div className="overflow-hidden rounded-xl">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-sm bg-gradient-to-r from-orange-100 to-gray-100 text-gray-700 border-b-2 border-orange-200">
                <th className="p-2 text-left">
                  Particular (Including Overdue)
                </th>
                <th className="p-2 text-right">{`${data.settings.assignees} ${data.settings.assigneeShare}%`}</th>
                <th className="p-2 text-right">{`${data.settings.assignor} ${data.settings.assignorShare}%`}</th>
                <th className="p-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className="text-sm text-gray-600 border-t border-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="p-2 text-left">{row.particular}</td>
                  <td className="p-2 text-right">{row.values[0]}</td>
                  <td className="p-2 text-right">{row.values[1]}</td>
                  <td className="p-2 text-right">{row.values[2]}</td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="text-sm border-t border-gray-300 font-semibold text-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                <td className="p-2 text-left">{`Closing Balance as on (${lastDay})`}</td>
                <td className="p-2 text-right">
                  {formatNumber(
                    parseInt(
                      data?.data?.assigneeOpening -
                      data?.data?.totalprincipalcollection *
                      (data?.settings?.assigneeShare / 100)
                    )
                  )}
                </td>
                <td className="p-2 text-right">
                  {formatNumber(
                    parseInt(
                      data?.data?.assignorOpening -
                      data?.data?.totalprincipalcollection *
                      (data?.settings?.assignorShare / 100)
                    )
                  )}
                </td>
                <td className="p-2 text-right">
                  {formatNumber(
                    data?.data?.openingBalance -
                    data?.data?.totalprincipalcollection
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrincipalSummary;
