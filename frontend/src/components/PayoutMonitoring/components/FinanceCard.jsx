import React from "react";
import PrincipalSummary from "./Table/PrincipalSummary";
import TotalBilling from "./Table/TotalBilling";
import TotalCollection from "./Table/TotalCollection";
import CashOutflow from "./Table/CashOutflow";
import AssignorAgeing from "./Table/AssignorAgeing";
import TotalAgeningChart from "./Charts/totalageningchart";
import AssigneeAgeingDonutChart from "./Charts/assigneeguagechart"
import PrincipalSummaryPieChart from "./Charts/pricipalsummarychart";
import AssigneeAgeing from "./Table/AssigneeAgeing";
import TotalCollectionChart from "./Charts/totalcollectionchart";
import TotalBillingChart from './Charts/totalbillingchart'
import CashOutflowChart from "./Charts/cashoutflowchart";
const FinanceCard = ({ data, month }) => {
  // console.log(data);
  // console.log(month);
  return (
    <div className="w-full mx-auto relative flex flex-col mt-4 mb-2 bg-white border-slate-200 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 p-3">
        <h2 className="text-xl font-semibold text-white">
          {data.dealname || "Deal Name"}: {data.month || "Month"}
        </h2>
      </div>

      <div className="text-xs">
        <div className="mt-5 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-2">
          <PrincipalSummary data={data} />
          <PrincipalSummaryPieChart data={data} />
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-2">
          <TotalBillingChart data={data} />
          <TotalBilling data={data} />

          <TotalCollection data={data} />
          <TotalCollectionChart data={data} />

          <CashOutflowChart data={data} />
          <CashOutflow data={data} />
        </div>

        <div className="flex gap-1 mt-2">
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-2">
          <AssignorAgeing data={data} />
          <TotalAgeningChart data={data} />

          <AssigneeAgeingDonutChart data={data} />
          <AssigneeAgeing data={data} />
          {/* </Card> */}
        </div>
      </div>
    </div>
  );
};

export default FinanceCard;
