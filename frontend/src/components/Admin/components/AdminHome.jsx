import React, { useEffect, useState, useRef } from "react";
import { getallusers } from "./../../../api/adminapi";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";

function AdminHome() {
  const [data, setData] = useState({
    totalUsers: 0,
    admins: 0,
    employees: 0,
    verified: 0,
    notVerified: 0,
    Users: 0,
  });

  const user = useSelector((state) => state.user);

  const barChartRef = useRef();
  const pieChartRef = useRef();
  const downloadButtonBarRef = useRef();
  const downloadButtonPieRef = useRef();
  const gradientBarPieRef = useRef();
  const gradientBarBarRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getallusers();
        const users = result.data;
        const totalUsers = users.length;
        const Users = users.filter((user) => user.role === "User").length;
        const admins = users.filter((user) => user.role === "Admin").length;
        const employees = users.filter(
          (user) => user.role === "Employee"
        ).length;
        const verified = users.filter((user) => user.isVerified).length;
        const notVerified = totalUsers - verified;

        setData({
          totalUsers: totalUsers,
          admins: admins,
          employees: employees,
          Users: Users,
          verified: verified,
          notVerified: notVerified,
        });

        toast.success("Details rendered successfully");
      } catch (error) {
        toast.error("Error in fetching the details");
        setData({
          totalUsers: 10,
          Users: 2,
          admins: 2,
          employees: 3,
          verified: 2,
          notVerified: 3,
        });
      }
    };

    loadData();
  }, []);

  const handleDownload = async (chartRef, buttonRef, gradientRef, filename) => {
    // Hide the download button and gradient bar
    if (buttonRef.current) {
      buttonRef.current.style.display = "none";
    }
    if (gradientRef.current) {
      gradientRef.current.style.display = "none";
    }

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 3 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = filename;
      link.click();
    }

    // Show the download button and gradient bar again
    if (buttonRef.current) {
      buttonRef.current.style.display = "block";
    }
    if (gradientRef.current) {
      gradientRef.current.style.display = "block";
    }
  };

  const barChartData = [
    { name: "Total Users", count: data.totalUsers },
    { name: "Users", count: data.Users },
    { name: "Admins", count: data.admins },
    { name: "Employees", count: data.employees },
    { name: "Verified", count: data.verified },
    { name: "Not Verified", count: data.notVerified },
  ];

  const pieChartData = [
    { name: "Total Users", value: data.totalUsers },
    { name: "Users", value: data.Users },
    { name: "Admins", value: data.admins },
    { name: "Employees", value: data.employees },
    { name: "Verified", value: data.verified },
    { name: "Not Verified", value: data.notVerified },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  return (
    <div className="p-5 bg-white">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
          Admin Dashboard
        </h1>
        {/* Display dynamic user name */}
        <p className="text-lg text-gray-600">
          Welcome back, {user.firstname} {user.lastname}!
        </p>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-lg font-semibold text-center text-orange-600">
            Total Users
          </h2>
          <p className="text-xl font-bold text-center text-orange-500">
            {data.totalUsers}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-lg font-semibold text-center text-orange-600">
            Users
          </h2>
          <p className="text-xl font-bold text-center text-orange-500">
            {data.Users}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-lg font-semibold text-center text-yellow-600">
            Admins
          </h2>
          <p className="text-xl font-bold text-center text-yellow-500">
            {data.admins}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-lg font-semibold text-center text-amber-700">
            Employees
          </h2>
          <p className="text-xl font-bold text-center text-amber-600">
            {data.employees}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-lg font-semibold text-center text-green-600">
            Verified
          </h2>
          <p className="text-xl font-bold text-center text-green-500">
            {data.verified}
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-lg font-semibold text-center text-red-600">
            Not Verified
          </h2>
          <p className="text-xl font-bold text-center text-red-500">
            {data.notVerified}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Distribution Pie Chart */}
        <div
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-transform transform hover:scale-105 relative overflow-hidden"
          ref={pieChartRef}
        >
          <div
            ref={gradientBarPieRef} // Ref for the Pie Chart gradient bar
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"
          ></div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-center text-gray-700 mt-4 mb-4">
              User Distribution
            </h2>
            <button
              ref={downloadButtonPieRef}
              className="text-orange-500 hover:text-orange-400 transition-colors duration-300 transition-transform transform hover:scale-110"
              onClick={() =>
                handleDownload(
                  pieChartRef,
                  downloadButtonPieRef,
                  gradientBarPieRef,
                  "user-distribution-chart.png"
                )
              }
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={325}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                startAngle={90} // Start angle at 90 degrees
                endAngle={-270} // End angle at -270 degrees for clockwise animation
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#6B7280"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      style={{ fontSize: "12px" }}
                    >
                      {/* {`${(percent * 100).toFixed(0)}%`} */}
                    </text>
                  );
                }}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#color${index})`} />
                ))}
              </Pie>

              {/* Gradients for Pie Slices */}
              <defs>
                {pieChartData.map((_, index) => (
                  <linearGradient
                    id={`color${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                    key={index}
                  >
                    <stop
                      offset="5%"
                      stopColor={COLORS[index % COLORS.length]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS[index % COLORS.length]}
                      stopOpacity={0.4}
                    />
                  </linearGradient>
                ))}
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                }}
                itemStyle={{ color: "#1F2937" }}
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ fontSize: "12px", color: "#6B7280" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Statistics Bar Chart */}
        <div
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-transform transform hover:scale-105 relative overflow-hidden"
          ref={barChartRef}
        >
          <div
            ref={gradientBarBarRef} // Ref for the Bar Chart gradient bar
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500"
          ></div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-center text-gray-700 mt-4 mb-4">
              User Statistics
            </h2>
            <button
              ref={downloadButtonBarRef}
              className="text-orange-500 hover:text-orange-400 transition-colors duration-300 transition-transform transform hover:scale-110"
              onClick={() =>
                handleDownload(
                  barChartRef,
                  downloadButtonBarRef,
                  gradientBarBarRef,
                  "user-statistics-chart.png"
                )
              }
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={325}>
            <BarChart data={barChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                }}
                itemStyle={{ color: "#1F2937" }}
              />
              <Bar dataKey="count">
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorBar${index})`} />
                ))}
              </Bar>
              {/* Gradients for Bar Chart */}
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    id={`colorBar${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                    key={index}
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default AdminHome;
