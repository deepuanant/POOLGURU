import React, { useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { FaLock } from "react-icons/fa";

const AssignorAgeingDonutChart = ({ data }) => {
  const chartRef = useRef();
  const downloadButtonRef = useRef();
  const gradientBarRef = useRef();

  // Check if data is available
  const hasData = !!data && data.totalageing && data.totalageing.length > 0;

  // Prepare donut chart data
  const chartData = data?.totalageing?.map((item) => ({
    name: item.finalNpa,
    value: item.count,
  }));

  // Predefined color gradients for each finalNpa name
  const GRADIENTS = {
    "No-Overdue": { start: "#00C49F", end: "#00C49FCC" }, // Green Gradient (Safe)
    "SMA-0": { start: "#A1C349", end: "#A1C349CC" }, // Light Green Gradient (Low Risk)
    "SMA-1": { start: "#FFD700", end: "#FFD700CC" }, // Golden Yellow Gradient (Moderate Risk)
    "SMA-2": { start: "#FFA500", end: "#FFA500CC" }, // Orange Gradient (Medium Risk)
    "Sub-Standard": { start: "#FF8C00", end: "#FF8C00CC" }, // Dark Orange Gradient (High Risk)
    "Doubtful-1": { start: "#FF6347", end: "#FF6347CC" }, // Tomato Red Gradient (Higher Risk)
    "Doubtful-2": { start: "#FF4500", end: "#FF4500CC" }, // Orange-Red Gradient (Severe Risk)
    "Doubtful-3": { start: "#DC143C", end: "#DC143CCC" }, // Crimson Gradient (Critical Risk)
    Loss: { start: "#B22222", end: "#B22222CC" }, // Firebrick Red Gradient (Max Danger)
  };

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
      link.download = "AssignorAgeingDonutChart.png";
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
    <div
      className="transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white rounded-2xl shadow-lg p-2 relative overflow-hidden mb-4"
      ref={chartRef}
    >
      {/* Gradient top bar */}
      <div
        ref={gradientBarRef}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"
      ></div>

      {/* Header section with download option */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-orange-500">Total Ageing</h2>
        <button
          ref={downloadButtonRef}
          className="text-orange-500 hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
          onClick={handleDownload}
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
      </div>

      {/* No Data Message */}
      <div
        className={`absolute inset-0 bg-gray-100 bg-opacity-20 backdrop-blur-sm flex items-center gap-3 justify-center transition-opacity duration-500 ease-in-out ${hasData ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <FaLock size={20} className="text-orange-400" />
        <span className="text-gray-500 text-lg">
          Not enough data to display
        </span>
      </div>

      {/* Donut Chart */}
      {hasData && (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            {/* Define Gradients */}
            <defs>
              {Object.keys(GRADIENTS).map((key, index) => (
                <linearGradient
                  key={index}
                  id={`gradient-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={GRADIENTS[key].start}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={GRADIENTS[key].end}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={90}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-${entry.name})`} // Apply gradient by name
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                fontSize: "12px",
                color: "#4B5563",
                marginBottom: "-10px",
                textAlign: "center",
              }}
              formatter={(value, entry, index) => {
                const count = chartData[index].value;
                return `${value} (${count})`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AssignorAgeingDonutChart;
