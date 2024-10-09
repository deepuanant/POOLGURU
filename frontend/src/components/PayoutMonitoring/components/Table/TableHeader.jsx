import React from "react";

const TableHeader = ({ columns }) => (
  <thead>
    <tr className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-orange-900 dark:to-gray-800">
      {columns.map((col) => (
        <th
          key={col}
          className="text-left border-b-2 border-orange-200 p-2 text-sm text-gray-700 dark:text-gray-300 font-semibold"
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);

export default TableHeader;
