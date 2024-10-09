import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { FaLock } from "react-icons/fa";

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

// 3D-styled Bar Chart component (Side-by-side bars)
const TotalBillingChart = ({ data }) => {
  const chartRef = useRef(); // Reference to chart container
  const downloadButtonRef = useRef(); // Ref for download button
  const gradientBarRef = useRef(); // Ref for gradient bar

  // Determine if there is enough data to display the chart
  const hasData = !!data && !!data.data;

  // Prepare chart data (without Total row)
  const chartData = [
    {
      name: "Current Billing",
      Principal: data?.data?.billingPrincipal || 0,
      Interest: data?.data?.billingInterest || 0,
    },
    {
      name: "Prepayments",
      Principal: data?.data?.billingPrepayment || 0,
      Interest: 0,
    },
    {
      name: "Charges",
      Principal: data?.data?.totalCharges || 0,
      Interest: 0,
    },
  ];

  // Colors for Principal and Interest
  const colors = ["#10B981", "#F59E0B"]; // Orange and Green

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
      link.download = "barchart.png";
      link.click();
    }

    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = "block";
    }
    if (gradientBarRef.current) {
      gradientBarRef.current.style.display = "block";
    }
  };

  // Custom Y-axis formatter for currency
  const currencyFormatter = (value) => `₹${formatNumberToWords(value)}`;

  return (
    <div
      className="transition-all duration-300 ease-in-out hover:-translate-y-2 relative rounded-xl p-2 bg-white shadow-lg overflow-hidden mb-4"
      ref={chartRef}
    >
      {/* Gradient top bar */}
      <div
        ref={gradientBarRef}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"
      ></div>

      {/* Header section */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-orange-500 mb-4">
          Billing Breakdown
        </h3>
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

      {/* Responsive Container for Bar Chart */}
      <div style={{ marginRight: "20px" }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={currencyFormatter} // Format Y-axis ticks as currency
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

            {/* Bars for Principal and Interest */}
            <Bar
              dataKey="Principal"
              fill="url(#colorPrincipal)"
              barSize={30}
            />
            <Bar dataKey="Interest" fill="url(#colorInterest)" barSize={30} />

            {/* Gradients for the bars */}
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overlay for no data */}
      <div
        className={`absolute inset-0 bg-gray-100 bg-opacity-20 backdrop-blur-sm flex items-center gap-3 justify-center transition-opacity duration-500 ease-in-out ${hasData ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <FaLock size={20} className="text-orange-400" />
        <span className="text-gray-500 text-lg">
          Not enough data to display
        </span>
      </div>
    </div>
  );
};

export default TotalBillingChart;
