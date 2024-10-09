// ReportPDF.jsx
import React, { useRef } from "react";
import { toast } from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const PDFReport = ({ originalData, reportRef }) => {
  const handleDownloadPDF = () => {
    if (!originalData || originalData.length === 0) {
      toast.error("No data available for download");
      return;
    }

    const fetchIPAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error("Error fetching IP address:", error);
        return "Unknown IP";
      }
    };

    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    fetchIPAddress().then((ipAddress) => {
      if (reportRef.current) {
        const element = reportRef.current;
        const options = {
          margin: [10, 0, 10, 0],
          filename: "PayoutAnalysisReport.pdf",
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
            before: ".page-break",
          },
        };

        const logoUrl = "src/assets/poolguru-logo-grey.png";
        const logoWidth = 13;
        const logoHeight = 10;

        const img = new Image();
        img.src = logoUrl;

        const pdfDownloadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            html2pdf()
              .set(options)
              .from(element)
              .toPdf()
              .get("pdf")
              .then((pdf) => {
                const pageCount = pdf.internal.getNumberOfPages();
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                for (let i = 1; i <= pageCount; i++) {
                  pdf.setPage(i);

                  // Header
                  pdf.setFillColor(255, 255, 255);
                  pdf.rect(0, 0, pageWidth, 20, "F");

                  pdf.setTextColor(255, 165, 0);
                  pdf.setFontSize(16);
                  pdf.setFont("helvetica", "bold");
                  pdf.text("Payout Analysis - Report", 10, 12);

                  pdf.addImage(
                    img,
                    "PNG",
                    pageWidth - logoWidth - 10,
                    5,
                    logoWidth,
                    logoHeight
                  );
                  pdf.setDrawColor(255, 165, 0); // Set HR line color
                  pdf.line(10, 18, pageWidth - 10, 18);
                  // Footer
                  pdf.setDrawColor(255, 165, 0);
                  pdf.line(
                    10,
                    pageHeight - 15,
                    pageWidth - 10,
                    pageHeight - 15
                  );

                  pdf.setTextColor(0, 0, 0);
                  pdf.setFontSize(8);
                  pdf.setFont("helvetica", "normal");

                  const leftFooterText = `© ${currentYear}, Treyst Infotech Pvt Ltd, All Rights Reserved.`;
                  const rightFooterText = `Printed on: ${currentDate} at ${currentTime} Using IP Address: ${ipAddress}`;

                  pdf.text(leftFooterText, 10, pageHeight - 6);
                  pdf.text(rightFooterText, pageWidth - 10, pageHeight - 6, {
                    align: "right",
                  });

                  // Watermark
                  pdf.saveGraphicsState();
                  pdf.setGState(new pdf.GState({ opacity: 0.3 }));
                  pdf.setTextColor(150);
                  pdf.setFontSize(72);
                  pdf.setFont("helvetica", "bold");
                  pdf.text(
                    "CONFIDENTIAL",
                    (pageWidth + 40) / 2,
                    (pageHeight + 150) / 2,
                    {
                      angle: 45,
                      align: "center",
                      charSpace: 2,
                    }
                  );
                  pdf.restoreGraphicsState();
                }
                pdf.save();
                resolve();
              })
              .catch((err) => reject(err));
          };
        });

        toast.promise(pdfDownloadPromise, {
          loading: "Downloading PDF...",
          success: "PDF downloaded successfully!",
          error: "Failed to download PDF!",
        });
      }
    });
  };

  return (
    <div className="group relative flex items-center">
      <button
        className="relative text-orange-500 hover:text-orange-400 duration-300 focus:outline-none transition-transform transform hover:scale-110"
        onClick={handleDownloadPDF}
        disabled={!originalData || originalData.length === 0} // Disable button if data is not ready
      >
        <FaDownload size={20} />
      </button>

      {/* Tooltip */}
      <div className="absolute top-full mt-1 ms-[-42px] hidden group-hover:block w-max px-2 py-1 text-sm text-white bg-black rounded-md">
        download
      </div>
    </div>
  );
};

export default PDFReport;
