import React, { useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { FaLock } from "react-icons/fa";

const AssignorAgeingGauge = ({ data }) => {
  const chartRef = useRef(); // Create a ref to reference the chart container
  const downloadButtonRef = useRef(); // Ref for the download button
  const gradientBarRef = useRef(); // Ref for the gradient top bar

  // Check if data is available
  const hasData = !!data && data?.totalageing && data?.totalageing?.length > 0;

  // Calculate total ClosingBalanceSum
  const totalClosingBalanceSum = data?.totalageing?.reduce(
    (acc, item) => acc + (item.ClosingBalanceSum || 0),
    0
  );

  // Calculate ClosingBalanceSum for "No-Overdue"
  const noOverdueClosingBalanceSum = data?.totalageing?.find(
    (item) => item.finalNpa === "No-Overdue"
  )?.ClosingBalanceSum;

  // Calculate percentage
  const noOverduePercentage = totalClosingBalanceSum
    ? ((noOverdueClosingBalanceSum / totalClosingBalanceSum) * 100).toFixed(2)
    : 0;

  const remainingPercentage = (100 - noOverduePercentage).toFixed(2);

  // Data for Gauge
  const gaugeData = [
    { name: "No-Overdue", value: parseFloat(noOverduePercentage) },
    { name: "Other", value: parseFloat(remainingPercentage) },
  ];

  // State to track the active index (hovered slice)
  const [activeIndex, setActiveIndex] = useState(null);

  // Handle mouse events for hover effects
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const handleDownload = async () => {
    // Hide the download button and gradient bar
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = "none";
    }
    if (gradientBarRef.current) {
      gradientBarRef.current.style.display = "none";
    }

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 3 }); // Increase the scale for better resolution
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "AssignorAgeingGauge.png";
      link.click();
    }

    // Show the download button and gradient bar again
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = "block";
    }
    if (gradientBarRef.current) {
      gradientBarRef.current.style.display = "block";
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-5 relative overflow-hidden mb-4"
      style={{ width: "100%", height: "310px" }}
      ref={chartRef} // Apply ref to the outer container
    >
      {/* Gradient top bar */}
      <div
        ref={gradientBarRef} // Ref for the gradient bar to hide/show
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"
      ></div>

      {/* Header section with title and icons */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-orange-500">
          Collection Efficiency
        </h3>
        <div className="flex items-center space-x-2">
          <button
            ref={downloadButtonRef} // Ref for the button to hide/show
            className="text-orange-500 hover:text-orange-400 transition-colors duration-300 transition-transform transform hover:scale-110"
            onClick={handleDownload}
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Responsive Container for Gauge Chart */}
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            {/* Gradients for Gauge Chart */}
            <defs>
              {/* Gradient for No-Overdue (Green) */}
              <linearGradient id="gradient-green" x1="0" y1="0" x2="1" y2="1">
                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00C49FCC" stopOpacity={0.6} />
              </linearGradient>

              {/* Gradient for Remaining (Red) */}
              <linearGradient id="gradient-red" x1="0" y1="0" x2="1" y2="1">
                <stop offset="5%" stopColor="#FF6347" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF6347CC" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            {/* Legend for Gauge Chart */}
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ top: 10, fontSize: "12px", color: "#6B7280" }}
            />

            {/* Gauge Chart using Pie with hover effect */}
            <Pie
              data={gaugeData}
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              stroke="none"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              activeIndex={activeIndex}
              activeShape={{
                fillOpacity: 0.8,
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            >
              {gaugeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${index === 0 ? "green" : "red"})`} // Apply gradient by index
                  opacity={activeIndex === index ? 0.8 : 1}
                  cursor="pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
              }}
              itemStyle={{ color: "#1F2937" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <FaLock size={20} className="text-orange-400" />
          <span className="text-gray-500 text-lg">
            Not enough data to display
          </span>
        </div>
      )}

      {/* Centered Percentage Text */}
      {hasData && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ marginTop: "100px" }}
        >
          <span className="text-2xl font-bold text-green-500 dark:text-red-500">
            {noOverduePercentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AssignorAgeingGauge;
