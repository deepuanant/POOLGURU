import React, { useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaLock } from "react-icons/fa";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";

// Utility to format numbers into words
const formatNumberToWords = (number) => {
  if (typeof number === "string") return number; // Handle cases like "0.02CR"
  if (number === null || number === undefined) return "0.00";

  const absNumber = Math.abs(number);
  if (absNumber >= 1e9) {
    return (number / 1e9).toFixed(2) + " Bn";
  } else if (absNumber >= 1e6) {
    return (number / 1e6).toFixed(2) + " Mn";
  } else if (absNumber >= 1e5) {
    return (number / 1e5).toFixed(2) + " L";
  } else {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  }
};

// Area chart component for Cash Outflow
const CashOutflowChart = ({ data }) => {
  const chartRef = useRef(); // Reference to chart container
  const downloadButtonRef = useRef(); // Ref for download button
  const gradientBarRef = useRef(); // Ref for gradient bar

  // Extract dynamic values for legend
  const assigneeLabel = data?.settings?.assignees;
  const assignorLabel = data?.settings?.assignor;

  // Prepare chart data (categories as Principal, Interest, Charges)
  const chartData = [
    {
      name: "Principal",
      [assigneeLabel]: data?.data?.assigneeprincipalshare || 0,
      [assignorLabel]:
        data?.data?.currrentprincipal +
        data?.data?.prepayment +
        data?.data?.overdueprincipal -
        (data?.data?.assigneeprincipalshare || 0),
    },
    {
      name: "Interest",
      [assigneeLabel]: data?.data?.assigneeinterestshare || 0,
      [assignorLabel]:
        data?.data?.currentintrest +
        data?.data?.overdueinterest -
        (data?.data?.assigneeinterestshare || 0),
    },
    {
      name: "Charges",
      [assigneeLabel]:
        data?.data?.currentcharges * (data?.settings?.assigneeShare / 100) || 0,
      [assignorLabel]:
        data?.data?.currentcharges -
        data?.data?.currentcharges * (data?.settings?.assigneeShare / 100) ||
        0,
    },
  ];

  // Y-axis formatter for currency
  const currencyFormatter = (value) => `₹${formatNumberToWords(value)}`;

  // Check if data is available
  const hasData = !!data && !!data.data;

  // Download functionality
  const handleDownload = async () => {
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = "none";
    }
    if (gradientBarRef.current) {
      gradientBarRef.current.style.display = "none";
    }

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 3 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "cashoutflowchart.png";
      link.click();
    }

    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = "block";
    }
    if (gradientBarRef.current) {
      gradientBarRef.current.style.display = "block";
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white rounded-2xl shadow-lg p-2 relative overflow-hidden mb-4" ref={chartRef}>
      {/* Gradient top bar */}
      <div ref={gradientBarRef} className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

      {/* No Data Message */}
      <div
        className={`absolute inset-0 bg-gray-100 bg-opacity-70 backdrop-blur-sm flex items-center gap-3 justify-center transition-opacity duration-500 ease-in-out ${hasData ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <FaLock
          size={20}
          className="text-orange-400 transition-transform duration-500 ease-in-out"
        />
        <span className="text-gray-500 text-lg">
          Not enough data to display
        </span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-orange-500 mb-4">
          Cash Outflow
        </h2>
        <div className="flex items-center space-x-2">
          <button
            ref={downloadButtonRef}
            className="text-orange-500 hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
            onClick={handleDownload}
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Area Chart */}
      {hasData && (
        <div style={{ marginRight: "20px" }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={currencyFormatter}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                }}
                itemStyle={{ color: "#1F2937" }}
                formatter={(value) => formatNumberToWords(value)}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "12px", color: "#6B7280" }}
              />

              {/* Areas for dynamic Assignee and Assignor */}
              <Area
                type="monotone"
                dataKey={assigneeLabel}
                stroke="#10B981"
                fillOpacity={0.3}
                fill="url(#colorAssignee)"
              />
              <Area
                type="monotone"
                dataKey={assignorLabel}
                stroke="#F59E0B"
                fillOpacity={0.3}
                fill="url(#colorAssignor)"
              />

              {/* Gradients for the areas */}
              <defs>
                <linearGradient id="colorAssignee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorAssignor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CashOutflowChart;
