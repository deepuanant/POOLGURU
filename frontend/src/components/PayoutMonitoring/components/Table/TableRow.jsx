import React from "react";

const TableRow = ({ particular, values, isTotalRow = false }) => (
  <tr
    className={`hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors ${
      isTotalRow ? "font-semibold" : ""
    }`}
  >
    <td
      className={`border-b border-gray-300 p-2 text-sm ${
        isTotalRow ? "font-semibold" : ""
      }`}
    >
      {particular}
    </td>
    {values.map((val, index) => (
      <td
        key={index}
        className={`border-b border-gray-300 p-2 text-sm text-left ${
          isTotalRow ? "font-semibold" : ""
        }`}
      >
        {val}
      </td>
    ))}
  </tr>
);

export default TableRow;
