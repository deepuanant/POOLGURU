import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const Table = ({ title, columns, rows, fontSize = "text-xs" }) => (
  <div className="w-full p-2">
    <h3 className="text-lg font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
      {title}
    </h3>
    <div className="overflow-y-auto max-h-56">
      <table className={`w-full border-collapse rounded-lg shadow-sm overflow-hidden ${fontSize}`}>
        <TableHeader columns={columns} />
        <tbody className="bg-white dark:bg-gray-800">{rows}</tbody>
      </table>
    </div>
  </div>
);

export default Table;
