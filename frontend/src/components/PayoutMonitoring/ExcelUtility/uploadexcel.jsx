import React, { forwardRef, useState } from "react";
import { processXlsx } from "./ProcessExcel";
import * as XLSX from "xlsx";

const UploadExcel = forwardRef(({ handleFileUpload, setData }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({ step: null, message: null });

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files.length) {
      // console.log("No files selected.");
      setError({ step: 0, message: "No files selected." });
      return;
    }

    setProgress(0);
    setMessage("Processing Started...");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const uploadedSheetData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          dateNF: "yyyy-mm-dd",
        });

        const metrics = await processXlsx(uploadedSheetData);
        if (!metrics) {
          throw new Error("File processing failed.");
        }
        setProgress((prevProgress) => prevProgress + 1);
        setMessage(`File ${i + 1} Processed Successfully...`);

        await setData((prevData) => {
          if (!Array.isArray(prevData)) {
            prevData = []; // Ensure prevData is an array
          }
          return [...prevData, metrics];
        });
        setProgress((prevProgress) => prevProgress + 1);
        setMessage(`Data for file ${i + 1} Set Successfully...`);

        await handleFileUpload(file);
        setProgress((prevProgress) => prevProgress + 1);
        setMessage(`File ${i + 1} Uploaded Successfully...`);
      }

      e.target.value = ""; // Reset the input
    } catch (error) {
      // console.log("An error occurred:", error);
      setError({ step: 4, message: error.message });
    } finally {
      setIsModalOpen(false); // Close the modal after processing
    }
  };


  return (
    <>
      <input
        type="file"
        ref={ref}
        accept=".csv, .xlsx"
        multiple
        className="hidden" // Keep it hidden
        onChange={handleFileSelect}
      />
    </>
  );
});

export default UploadExcel;
