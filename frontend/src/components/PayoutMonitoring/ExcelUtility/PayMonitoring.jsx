import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { TrendingUpIcon, DownloadIcon, MapPinIcon } from "lucide-react";
import * as XLSX from "xlsx";
import file from "./Payout_monitoring.xlsx";

const DemoChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
        animations: {
          speed: 1000,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 350 },
        },
        background: "transparent",
      },
      labels: [
        "Opening Principle Overdue",
        "Opening Interest Overdue",
        "Billing Principal",
        "Billing Interest",
      ],
      colors: ["#6366F1", "#10B981", "#F59E0B", "#EF4444"],
      dataLabels: {
        enabled: true,
        formatter: (val, opts) =>
          `${opts.w.config.labels[opts.seriesIndex]}: ${val.toFixed(2)}%`,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.5,
        },
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          colors: ["#000000"],
        },
        connector: {
          enabled: true,
          length: "10%",
          style: {
            strokeWidth: 2,
            strokeColor: "#000000",
          },
        },
      },
      legend: {
        show: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
            background: "transparent",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "22px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#1F2937",
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: "28px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                color: "#1F2937",
                offsetY: 5,
                formatter: (val) => val.toFixed(2) + "%",
              },
              total: {
                show: true,
                showAlways: true,
                label: "Total",
                fontSize: "18px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#6B7280",
              },
            },
          },
        },
      },
      stroke: { show: false },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(2)}%`,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 300 },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });

      jsonData.forEach((row) => {
        for (let key in row) {
          if (key.includes("Unnamed")) {
            delete row[key];
          }
        }
      });

      const openingOverduePrinciple = jsonData.reduce(
        (acc, curr) =>
          acc + (parseFloat(curr["Opening Principle Overdue (100%)"]) || 0),
        0
      );
      const openingInterestOverdue = jsonData.reduce(
        (acc, curr) =>
          acc + (parseFloat(curr["Opening Interest Overdue (100%)"]) || 0),
        0
      );
      const billingPrincipal = jsonData.reduce(
        (acc, curr) => acc + (parseFloat(curr["Billing Principal"]) || 0),
        0
      );
      const billingInterest = jsonData.reduce(
        (acc, curr) => acc + (parseFloat(curr["Billing Interest"]) || 0),
        0
      );

      const chartValues = [
        openingOverduePrinciple,
        openingInterestOverdue,
        billingPrincipal,
        billingInterest,
      ];

      const totalValues = chartValues.reduce((acc, curr) => acc + curr, 0);
      const percentageValues = chartValues.map(
        (val) => (val / totalValues) * 100
      );

      setChartData((prevState) => ({
        ...prevState,
        series: percentageValues,
      }));
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl p-10 max-w-4xl mx-auto transition-all duration-300 hover:shadow-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Pool Summary
          </h2>
          <p className="text-sm text-gray-600">
            Comprehensive view of financial information trends
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-all duration-200 flex items-center shadow-md hover:shadow-lg">
            <DownloadIcon size={18} className="mr-2" />
            Export
          </button>
          <div className="bg-white text-indigo-600 p-4 rounded-full shadow-md">
            <TrendingUpIcon size={24} />
          </div>
        </div>
      </div>
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-700 mb-6">
          Total Billing Breakdown
        </h3>
        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={400}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {chartData.options.labels.map((label, index) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:scale-105 transform"
          >
            <div className="flex items-center justify-center mb-4">
              <MapPinIcon
                size={24}
                className={`mr-2 ${
                  [
                    "text-indigo-500",
                    "text-emerald-500",
                    "text-amber-500",
                    "text-red-500",
                  ][index]
                }`}
              />
              <p className="text-lg font-semibold text-gray-700">{label}</p>
            </div>
            <p
              className={`text-3xl font-bold ${
                [
                  "text-indigo-500",
                  "text-emerald-500",
                  "text-amber-500",
                  "text-red-500",
                ][index]
              }`}
            >
              {chartData.series[index]
                ? chartData.series[index].toFixed(2) + "%"
                : "0%"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoChart;
