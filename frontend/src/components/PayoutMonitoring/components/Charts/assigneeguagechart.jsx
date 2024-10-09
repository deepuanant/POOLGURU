import React, { useState, useRef, useMemo } from "react";
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

const AssigneeAgeingGauge = ({ data }) => {
  const chartRef = useRef();
  const downloadButtonRef = useRef();
  const gradientBarRef = useRef();

  // Memoize calculations for better performance
  const totalClosingBalanceSum = useMemo(
    () =>
      data?.npaMetrics?.reduce(
        (acc, item) => acc + (item.assigneeClosingBalanceSum || 0),
        0
      ),
    [data]
  );

  const noOverdueClosingBalanceSum = useMemo(
    () =>
      data?.npaMetrics?.find((item) => item.finalNpa === "No-Overdue")
        ?.assigneeClosingBalanceSum || 0,
    [data]
  );

  const noOverduePercentage = useMemo(
    () =>
      totalClosingBalanceSum
        ? ((noOverdueClosingBalanceSum / totalClosingBalanceSum) * 100).toFixed(
            2
          )
        : 0,
    [noOverdueClosingBalanceSum, totalClosingBalanceSum]
  );

  const remainingPercentage = useMemo(
    () => (100 - noOverduePercentage).toFixed(2),
    [noOverduePercentage]
  );

  const gaugeData = useMemo(
    () => [
      { name: "No-Overdue", value: parseFloat(noOverduePercentage) },
      { name: "Other", value: parseFloat(remainingPercentage) },
    ],
    [noOverduePercentage, remainingPercentage]
  );

  const hasData = useMemo(
    () => !!data && data?.npaMetrics && data?.npaMetrics?.length > 0,
    [data]
  );

  // State for hover effect on slices
  const [activeIndex, setActiveIndex] = useState(null);

  // Hover event handlers
  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  const handleDownload = async () => {
    // Temporarily hide elements for clean download
    downloadButtonRef.current.style.display = "none";
    gradientBarRef.current.style.display = "none";

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 3 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "AssigneeAgeingGauge.png";
      link.click();
    }

    // Restore the visibility of hidden elements
    downloadButtonRef.current.style.display = "block";
    gradientBarRef.current.style.display = "block";
  };

  return (
    <div
      className="transition-all duration-300 ease-in-out hover:-translate-y-2 bg-white rounded-2xl shadow-lg p-2 relative overflow-hidden mb-4"
      style={{ width: "100%", height: "300px" }}
      ref={chartRef}
    >
      {/* Gradient top bar */}
      <div
        ref={gradientBarRef}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"
      ></div>

      {/* Header section */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold text-orange-500">
          Collection Efficiency
        </h3>
        <button
          ref={downloadButtonRef}
          className="text-orange-500 hover:text-orange-400 transition-colors duration-300 transform hover:scale-110"
          onClick={handleDownload}
        >
          <DownloadIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Gauge Chart */}
      {hasData ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              {/* Gradients */}
              <defs>
                <linearGradient id="gradient-green" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00C49FCC" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="gradient-red" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="5%" stopColor="#FF6347" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF6347CC" stopOpacity={0.6} />
                </linearGradient>
              </defs>

              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ top: 10, fontSize: "12px", color: "#6B7280" }}
              />

              {/* Pie representing Gauge */}
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
              >
                {gaugeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index === 0 ? "green" : "red"})`}
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

          {/* Centered Percentage Text */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ marginTop: "80px" }}
          >
            <span className="text-2xl font-bold text-green-500 dark:text-red-500">
              {noOverduePercentage}%
            </span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <FaLock size={20} className="text-orange-400" />
          <span className="text-gray-500 text-lg">
            Not enough data to display
          </span>
        </div>
      )}
    </div>
  );
};

export default AssigneeAgeingGauge;
