import React, { useRef, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaLock } from "react-icons/fa";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";

// Utility to format numbers into words
const formatNumberToWords = (number) => {
  if (typeof number === "string") return number;
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

const PrincipalSummaryPieChart = ({ data }) => {
  const chartRef = useRef();
  const downloadButtonRef = useRef();
  const gradientBarRef = useRef();

  // Memoize pie data calculation
  const pieData = useMemo(() => {
    const assigneePrincipalCollection =
      data?.data?.totalprincipalcollection *
        (data?.settings?.assigneeShare / 100) || 0;
    const assignorPrincipalCollection =
      data?.data?.totalprincipalcollection *
        (data?.settings?.assignorShare / 100) || 0;

    return [
      {
        name: data?.settings?.assignees,
        value: parseFloat(assigneePrincipalCollection.toFixed(2)),
      },
      {
        name: data?.settings?.assignor,
        value: parseFloat(assignorPrincipalCollection.toFixed(2)),
      },
    ];
  }, [data]);

  const hasData = useMemo(() => !!data && !!data.data, [data]);

  // Define gradient colors for the chart (can also be memoized if necessary)
  const gradients = useMemo(
    () => [
      { id: "gradientAssignee", start: "#10B981", end: "#10B981" },
      { id: "gradientAssignor", start: "#F59E0B", end: "#F59E0B" },
    ],
    []
  );

  // Download functionality
  const handleDownload = async () => {
    if (downloadButtonRef.current)
      downloadButtonRef.current.style.display = "none";
    if (gradientBarRef.current) gradientBarRef.current.style.display = "none";

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 3 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "piechart.png";
      link.click();
    }

    if (downloadButtonRef.current)
      downloadButtonRef.current.style.display = "block";
    if (gradientBarRef.current) gradientBarRef.current.style.display = "block";
  };

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
        <h2 className="text-xl font-semibold text-orange-500 mb-2">
          Principal Distribution
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

      {/* No Data Message with Transition */}
      {!hasData && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-20 backdrop-blur-sm flex items-center gap-3 justify-center transition-opacity duration-500 ease-in-out opacity-100">
          <FaLock size={20} className="text-orange-400" />
          <span className="text-gray-500 text-lg">
            Not enough data to display
          </span>
        </div>
      )}

      {/* Responsive Container for the Pie Chart */}
      {hasData && (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            {/* Define Gradients */}
            <defs>
              {gradients.map((gradient) => (
                <linearGradient
                  key={gradient.id}
                  id={gradient.id}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={gradient.start}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={gradient.end}
                    stopOpacity={0.4}
                  />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={95}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#${gradients[index % gradients.length].id})`}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${formatNumberToWords(value)}`} />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ marginBottom: -15 }}
              formatter={(value, entry) =>
                `${value}: ₹${formatNumberToWords(entry.payload.value)}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PrincipalSummaryPieChart;
