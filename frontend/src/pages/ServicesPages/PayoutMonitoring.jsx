import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast"; // Import toast
import DownloadTemplate from "../../components/PayoutMonitoring/ExcelUtility/downloadtemplate";
import FilterSidebar from "../../components/PayoutMonitoring/Filtersidebar";
import FinanceCard from "../../components/PayoutMonitoring/components/FinanceCard";
import ScrollToTopButton from "../../components/miscellaneous/ScrollToTopButton";
import ExportExcel from "../../components/PayoutMonitoring/ExcelUtility/ExportExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import generateExcelFile from "../../components/PayoutMonitoring/ExcelUtility/generatedataexcel";
import { FaBars } from "react-icons/fa";
// import html2pdf from "html2pdf.js";
import PayoutAnalysisReport from "../../components/PayoutMonitoring/PayoutAnalysisReport";
// import OtherFooter from "../../components/landing/OtherFooter";

const PoolMonitoring = () => {
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [partpaydate, setPartpaydate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState("");
  const [exportData, setExportData] = useState([]);
  const reportRef = useRef(null);
  const [proccessedData, setProcessedData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [dataReady, setDataReady] = useState(false);

  const extractMonth = (filename) => {
    const monthMapping = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      10: "October",
      11: "November",
      12: "December",
    };
    const monthIndex = filename.split("-")[0];
    return monthMapping[monthIndex] || "Unknown Month";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const handleProcessExcel = () => {
    downloadExcel(
      startDate,
      endDate,
      partpaydate,
      setStartDate,
      setEndDate,
      setPartpaydate,
      setShowModal
    );
  };

  const handleApplyFilters = () => {
    // console.log("Filters applied!");
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      const fileName = file.name;
      const extractedMonth = extractMonth(fileName);
      setMonth(extractedMonth);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (proccessedData) {
      setOriginalData(proccessedData);
      setDataReady(true);
    }
  }, [proccessedData]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen ">
      <Toaster position="top-center" />

      {/* Sidebar with toggle functionality */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onDownloadClick={() => setShowModal(true)}
        onFileSelect={handleFileSelect}
        setData={setData}
        toggleSidebar={toggleSidebar}
        setMonth={setMonth}
        setExportData={setExportData}
        setProccessedData={setProcessedData}
        processedData={proccessedData}
      />

      <div className="flex-1 min-h-screen p-4 overflow-auto bg-white">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={toggleSidebar}
            className="text-orange-500 lg:hidden hover:text-orange-400 transition-colors duration-300 rounded-lg text-sm p-1.5"
          >
            <FaBars size={20} />
          </button>
          <div className="flex justify-center flex-1">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-orange-500">
                Payout Analysis
              </h4>
              <p className="text-sm text-gray-700">
                Comprehensive view of Payout trends
              </p>
            </div>
          </div>

          <div className="flex gap-2 mr-4">
            <ExportExcel
              proccessedData={proccessedData ? proccessedData : null}
              setProccessedData={setProcessedData}
            />
            <div
              className="flex m-auto text-green-500 hover:text-green-800 duration-300 focus:outline-none transition-transform transform hover:scale-110 cursor-pointer"
              title="Summary Report"
              onClick={async () => {
                await generateExcelFile(originalData ? originalData : null);
                setDataReady(false);
                setOriginalData(null);
              }}
            >
              <div className="group relative flex items-center">
                <RiFileExcel2Fill size={16} />
                {dataReady && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-blue-500 bg-blue-500 animate-ping bg-opacity-100"></span>
                )}

                {/* <div className="absolute top-full mt-2 hidden group-hover:block w-max px-2 text-sm text-white bg-black rounded-md">
      Summary Report
    </div> */}
              </div>
              <span className="m-auto font-medium text-xs hidden lg:inline">
                Summary
              </span>
            </div>

            {/* <div className="group relative flex items-center"> */}
            {/* <PDFReport originalData={originalData} reportRef={reportRef} /> */}

            {/* Notification Icon */}
            {/* {dataReady && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-blue-500 bg-blue-500 animate-ping bg-opacity-100"></span>
              )} */}

            {/* <div className="absolute top-full mt-1 ms-[-42px] hidden group-hover:block w-max px-2 py-1 text-sm text-white bg-black rounded-md">
                download
              </div> */}
            {/* </div> */}
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out hover:-translate-y-2">
          <FinanceCard data={data} month={month} />
        </div>

        {/* Hidden report content for generating PDF */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <div ref={reportRef}>
            {originalData && originalData.length > 0 ? (
              <PayoutAnalysisReport proccessedData={originalData} />
            ) : (
              <div>No data available for the report.</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <DownloadTemplate
          startDate={startDate}
          endDate={endDate}
          partpaydate={partpaydate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setPartpaydate={setPartpaydate}
          handleSubmit={handleSubmit}
          processExcel={handleProcessExcel}
          onClose={() => setShowModal(false)}
        />
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default PoolMonitoring;
