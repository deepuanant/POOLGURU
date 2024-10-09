import { createBatch } from "../api/servicesapi";
import { toast } from "react-hot-toast";

export const handleCreateBatch = async (userId , validatedIsDoneorNOt="pending" , processIsDoneOrNot="pending", reportisDoneorNot="pending") => {
  let batchCompletedIsDoneOrNot = "pending";
    if(validatedIsDoneorNOt === "success" && processIsDoneOrNot === "success" && reportisDoneorNot === "success"){
      batchCompletedIsDoneOrNot = "success";
    }
    if (userId) {
      const status = "pending";
      const phases = {
        batchCreated: "success",
        validated: validatedIsDoneorNOt,
        processed: processIsDoneOrNot,
        reportGen: reportisDoneorNot,
        batchCompleted: batchCompletedIsDoneOrNot,
      };

      // console.log(status + " " + phases + " " + userId);
      try {
        const response = await createBatch(status, phases, userId);
        // console.log("Batch created successfully:", response);
        toast.success("Batch created successfully!");
      } catch (error) {
        console.error("Error creating batch:", error);
        toast.error("Error creating batch.");
      }
    } else {
      console.log("no user id provided");
    }
  };