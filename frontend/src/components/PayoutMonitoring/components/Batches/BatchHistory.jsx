import React, { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { getAllBatches } from "../../../../api/servicesapi";
import ModalforBatches from "./ModalforBatches";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const BatchHistory = ({ isOpen, onClose }) => {
  const [batches, setBatches] = useState([]);
  const [accordionData, setAccordionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchBatches = async () => {
      setIsLoading(true);
      try {
        const response = await getAllBatches(user.id);
        const fetchedBatches = response.data;

        // console.log("this is my response" , response)
        fetchedBatches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // console.log("Fetched batches:", fetchedBatches);
        setBatches(fetchedBatches);

        const data = fetchedBatches.map((batch) => ({
          title: `Batch ${new Date(batch.createdAt).toLocaleString()}`,
          steps: [
            { label: "Batch Created", status: batch.phases.batchCreated },
            { label: "Validated", status: batch.phases.validated },
            { label: "Processed", status: batch.phases.processed },
            { label: "Report Generated", status: batch.phases.reportGen },
            { label: "Batch Completed", status: batch.phases.batchCompleted },
          ],
          status: batch.status,
          id: batch._id,
        }));
        setAccordionData(data);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast.error("Failed to fetch batch data");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchBatches();
    }
  }, [isOpen]);

  return (
    <ModalforBatches
      isOpen={isOpen}
      onClose={onClose}
      message="Batch History"
      accordionData={accordionData}
    >
      {isLoading && (
        <div className="mt-2 flex items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading batches </span>
          <FiLoader className="animate-spin ml-2 text-orange-500" />
        </div>
      )}
    </ModalforBatches>
  );
};

export default BatchHistory;
