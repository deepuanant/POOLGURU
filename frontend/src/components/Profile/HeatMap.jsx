import React from "react";
import Chart from "react-apexcharts";

const HeatmapChart = () => {
  // Function to generate random data for each metric
  const generateData = (count, range) => {
    let data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: `W${i + 1}`, // Label for weeks or categories
        y: Math.floor(Math.random() * (range.max - range.min + 1)) + range.min, // Random value between range.min and range.max
      });
    }
    return data;
  };

  const options = {
    series: [
      {
        name: "Jan",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Feb",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Mar",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Apr",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "May",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Jun",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Jul",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Aug",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Sep",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Oct",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Nov",
        data: generateData(18, { min: 0, max: 90 }),
      },
      {
        name: "Dec",
        data: generateData(18, { min: 0, max: 90 }),
      },
    ],
    chart: {
      height: 350,
      type: "heatmap",
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#FFB02E"],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.6,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 30,
              color: "#FDE68A", // Light yellow
              name: "Low",
            },
            {
              from: 31,
              to: 60,
              color: "#FB923C", // Medium orange
              name: "Medium",
            },
            {
              from: 61,
              to: 90,
              color: "#EF4444", // Dark red
              name: "High",
            },
          ],
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    xaxis: {
      labels: {
        style: {
          colors: "#6B7280", // Text color for x-axis labels
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280", // Text color for y-axis labels
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "dark", // Tooltip theme
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Monthly Performance Heatmap
      </h3>
      <Chart
        options={options}
        series={options.series}
        type="heatmap"
        height={300}
      />
    </div>
  );
};

export default HeatmapChart;
