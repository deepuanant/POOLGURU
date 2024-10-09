import React, { useState, useEffect } from "react";
import { processXlsx } from "./ExcelUtility/ProcessExcel";
// import poolgurulogo from "../../assets/poolguru-logo-grey.png";
import axios from "axios";

const formatNumber = (number) => {
  if (number === null || number === undefined) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const PayoutAnalysisReport = ({ proccessedData = [], logo }) => {
  const [calculatedData, setCalculatedData] = useState({
    openingBalance: 0,
    assigneeOpening: 0,
    assignorOpening: 0,
    billingPrincipal: 0,
    billingInterest: 0,
    totalDue: 0,
    assignorClosing: 0,
    assigneeClosing: 0,
    closingBalance: 0,
  });

  const lastMonthData =
    proccessedData.length > 0
      ? proccessedData[proccessedData.length - 1]
      : null;
  const lastMonth = lastMonthData ? lastMonthData.month : "Unknown Month";

  useEffect(() => {
    if (lastMonthData) {
      const fetchCalculatedData = async () => {
        const response = await processXlsx(lastMonthData.data);
        if (response.status === "success") {
          setCalculatedData(response.data);
        }
      };
      fetchCalculatedData();
    }
  }, [lastMonthData]);

  const dealName =
    lastMonthData &&
    lastMonthData.data &&
    Array.isArray(lastMonthData.data[1]) &&
    lastMonthData.data[1][0]
      ? lastMonthData.data[1][0]
      : "No Deal Name Available";

  const currentDate = new Date().toLocaleDateString();

  const getLastDayOfMonth = (monthYearString) => {
    if (!monthYearString) return "Unknown Date";

    const [month, year] = monthYearString.split("-");
    const monthIndex = new Date(`${month} 1, 20${year}`).getMonth();
    const date = new Date(`20${year}`, monthIndex + 1, 0);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const lastPayoutDate = getLastDayOfMonth(lastMonth);

  const getFirstDayOfMonth = (monthYearString) => {
    if (!monthYearString) return "Unknown Date";

    const [month, year] = monthYearString.split("-");
    const monthIndex = new Date(`${month} 1, 20${year}`).getMonth();
    const date = new Date(`20${year}`, monthIndex, 1);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const firstPayoutDate = getFirstDayOfMonth(lastMonth);

  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    // Fetch the user's IP address
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setIpAddress(response.data.ip);
      })
      .catch((error) => {
        console.error("Error fetching the IP address:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="report-content max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg p-10">
        {/* Header with logo and title */}
        {/* <header className="flex justify-between items-center mb-6 pb-4 border-b-2 border-orange-200">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
            Payout Analysis - Report
          </h1>
          <img src={poolgurulogo} alt="Pool Guru Logo" className="w-15 h-10" />
        </header> */}

        {/* Deal Name and Collection Month */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-gray-900">
              <span className="text-lg font-semibold"> Deal Name: </span>
              <span className="text-md font-normal">{dealName}</span>
            </h2>
            <h2 className="text-gray-900">
              <span className="text-lg font-semibold"> Collection Month: </span>
              <span className="text-md font-normal">{lastMonth}</span>
            </h2>
          </div>
          <div>
            <h2 className="text-gray-900">
              <span className="text-lg font-semibold"> Date: </span>
              <span className="text-md font-normal">{currentDate}</span>
            </h2>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Executive Summary
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            This report presents a comprehensive analysis of the pool payout for{" "}
            <strong>{dealName}</strong> for the month ending{" "}
            <strong>{lastPayoutDate}</strong>. It includes detailed financial
            data such as principal summaries, billing and collection details,
            cash outflows, and an aging analysis of the loan portfolio. The
            primary objective of this report is to provide stakeholders with a
            thorough understanding of the pool performance to support informed
            decision-making and maintain regulatory compliance. It offers a
            detailed breakdown of principal and interest collections, cash
            outflows to investors, and a performance analysis of the loan
            portfolio. This report has been prepared exclusively for{" "}
            <strong>{dealName}</strong> and its designated stakeholders. The
            data and analysis contained herein are based on information provided
            by the user and have been processed and reconciled, using
            established accounting and auditing standards. While every effort
            has been made to ensure the accuracy and completeness of the
            information, this report should not be construed as financial,
            legal, or investment advice. Users of this report are cautioned to
            verify the details of this report before making any decisions.
          </p>
        </section>

        {/* Principal Summary */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Principal Summary
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            As of <strong>{firstPayoutDate}</strong>, the opening principal
            balance, including any overdue amounts, stood at a total of ₹{" "}
            <strong>{formatNumber(calculatedData.openingBalance)}</strong>. This
            comprises Grihum Housing Finance Limited's share of ₹{" "}
            <strong>{formatNumber(calculatedData.assigneeOpening)}</strong> and
            DBS Bank's share of ₹{" "}
            <strong>{formatNumber(calculatedData.assignorOpening)}</strong>.
            During the month, principal collections amounted to ₹34,79,254, with
            Grihum Housing Finance Limited collecting ₹3,47,925 and DBS Bank
            collecting ₹31,31,329. Consequently, the closing principal balance
            as of ₹<strong>{lastPayoutDate}</strong>, was ₹58,35,73,009, where
            Grihum's share is ₹5,83,57,301 and DBS Bank's share is
            ₹52,52,15,708.10.
          </p>
        </section>

        {/* Principal Summary Table */}
        <section className="report-content mb-8">
          <table className="min-w-full divide-y divide-gray-200 mb-6 border-b border-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Particular
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Assignee
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Assignor
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Opening Balance
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Principal Collection
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.totalDue)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Closing Balance
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assignorClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assigneeClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.closingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Total Billing */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Total Billing
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            During the billing period <strong>{lastMonth}</strong>, the total
            amount billed was ₹1,14,63,281, comprising ₹35,76,955 (31.2%) in
            principal, ₹78,86,326 (68.8%) in interest, and ₹70,060 (0.06%) in
            charges. The principal billing includes current billing of
            ₹18,96,063 and prepayments amounting to ₹16,10,832. There was no
            interest billed on prepayments, and the charges are solely
            principal-based. The interest billed, totaling ₹78,86,326,
            corresponds entirely to current billing. In conclusion, the
            financial performance for <strong>{lastMonth}</strong> is robust,
            with high collection rates and low levels of overdue accounts. The
            loan portfolio managed by <strong>{dealName}</strong> is performing
            well, reflecting effective management and adherence to regulatory
            standards. Continued diligence and strategic management are
            recommended to maintain these standards and to proactively address
            any potential challenges.
          </p>
        </section>

        {/* Total Billing Table */}
        <section className="report-content mb-8">
          <table className="min-w-full divide-y divide-gray-200 mb-6 border-b border-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Particular
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Principal
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Interest
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Current Billing
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Pre-Payment
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.totalDue)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Charges
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assignorClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assigneeClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.closingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Total Collection */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Total Collection
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            During the collection period, the total amount collected was
            ₹1,64,44,885, comprising ₹85,44,434 (52.0%) in principal, ₹79,00,451
            (48.0%) in interest, and ₹40,310 in charges. The principal
            collections include current billing of ₹79,00,451 and prepayments
            amounting to ₹66,47,248. There were no interest collections on
            prepayments, and the charges collected are entirely principal-based.
            The interest collections, totaling ₹79,00,451, correspond mainly to
            current billing. Notably, there is an overdue adjustment of
            ₹(60,43,575) in principal and ₹12,53,203 in interest, resulting in a
            net negative overdue amount of ₹(47,90,372).
          </p>
        </section>

        {/* Total Collection Table */}
        <section className="report-content mb-8 mt-44">
          <table className="min-w-full divide-y divide-gray-200 mb-6 border-b border-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Particular
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Principal
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Interest
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Current Billing
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Pre-Payment
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.totalDue)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Charges
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  Overdue
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assignorClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assigneeClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.closingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Cash Outflow Explanation */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Cash Outflow
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            During this period, the total cash outflow was ₹1,64,44,885,
            comprising ₹85,04,124 (51.7%) in principal, ₹79,00,451 (48.0%) in
            interest, and ₹40,310 in charges. The outflow was split between two
            major parties:
          </p>
          <ul className="list-disc list-inside text-md text-gray-700 mb-4 text-justify">
            <li>
              <strong>DBS Bank</strong>: The total outflow amounted to
              ₹1,04,92,173, consisting of ₹76,53,712 in principal, ₹28,02,182 in
              interest, and ₹36,279 in charges.
            </li>
            <li>
              <strong>IIHFL</strong>: The total outflow for this entity was
              ₹59,52,712, including ₹8,50,412 in principal, ₹50,98,269 in
              interest, and ₹4,031 in charges.
            </li>
          </ul>
          <p className="text-md text-gray-700 mb-4 text-justify">
            The principal outflow mainly went towards DBS Bank, which accounts
            for the majority share of principal repayments. On the other hand,
            IIHFL has a significantly higher interest outflow compared to
            principal, indicating that the bulk of the cash outflow to this
            entity is related to interest payments. The charges are relatively
            minimal for both entities, contributing only a small portion of the
            overall outflow.
          </p>
        </section>

        {/* Cash Flow Table */}
        <section className="report-content mb-8">
          <table className="min-w-full divide-y divide-gray-200 mb-6 border-b border-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Particular
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Principal
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Interest
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Charges
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  DBS Bank
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  IIHFL
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.totalDue)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assignorClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assignorClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.assigneeClosing)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  {formatNumber(calculatedData.closingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Assignor Ageing Explanation */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Assignor Ageing Summary
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            The ageing analysis for the portfolio includes a total of 294
            customers, with a POS (DBS Share), including overdue amounts,
            amounting to ₹24,94,05,734.70. Among these, 283 customers have no
            overdue amounts, representing ₹24,09,19,131.60 of the POS. There is
            no principal overdue for these accounts, and the interest overdue is
            a negligible ₹(0.1). Additionally, 8 customers fall within the 1-30
            days ageing bucket, with a POS of ₹84,86,603.10. The principal
            overdue for these customers amounts to ₹20,031.30, while the
            interest overdue stands at ₹44,920.90. Notably, there are no
            customers in the 31-60 days ageing bucket, and consequently, no POS,
            principal, or interest overdue is recorded for that period. Overall,
            the portfolio demonstrates healthy performance with a significant
            portion of customers maintaining no overdue amounts and a manageable
            level of overdue accounts.
          </p>
        </section>

        {/* Assignor Agening Table */}
        <section className="report-content mb-8">
          <table className="min-w-full divide-y divide-gray-200 mb-6 border-b border-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Ageing
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  No. of Customer
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  POS incl Overdue (DBS Share)
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Principal Overdue (DBS Share)
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Interest Overdue (DBS Share)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  No Overdue
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  01-30 Days
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.totalDue)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  31-60 Days
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  61-90 Days
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Assignee Ageing Explanation */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Assignee Ageing Summary
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            The ageing analysis for the assignee portfolio shows a total of 294
            customers, with a POS including overdue amounts totaling
            ₹27,71,17,483. Of these, 283 customers have no overdue amounts,
            representing ₹26,76,87,924 of the total POS. There are no principal
            or interest overdue for these accounts. However, 8 customers fall
            into the 1-30 days ageing bucket, with a POS of ₹94,29,559. The
            principal overdue for these customers is ₹22,257, while the interest
            overdue amounts to ₹1,25,918. Notably, there are no customers in the
            31-60 days, 61-90 days, sub-standard, doubtful, or loss categories,
            and no POS, principal, or interest overdue is recorded for these
            periods. Additionally, 3 closed accounts are recorded, without any
            overdue amounts.
          </p>
        </section>

        {/* Assignee Agening Table */}
        <section className="report-content mb-8 m-auto mt-28">
          <table className="min-w-full divide-y mt-3 divide-gray-200 mb-6 border-b border-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">
                  Ageing
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  No. of Customer
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  POS incl Overdue (DBS Share)
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Principal Overdue (DBS Share)
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium uppercase">
                  Interest Overdue (DBS Share)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  No Overdue
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  01-30 Days
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingPrincipal)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.billingInterest)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.totalDue)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  31-60 Days
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-6 py-4 text-left text-sm text-gray-900">
                  61-90 Days
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assigneeOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.assignorOpening)}
                </td>
                <td className="px-6 py-4 text-right text-sm text-gray-700">
                  {formatNumber(calculatedData.openingBalance)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Conclusion */}
        <section className="report-content mb-8">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Conclusion
          </h2>
          <p className="text-md text-gray-700 mb-4 text-justify">
            In conclusion, the financial performance for{" "}
            <strong>{lastMonth}</strong> is robust, with high collection rates
            and low levels of overdue accounts. The loan portfolio managed by{" "}
            <strong>{dealName}</strong> is performing well, reflecting effective
            management and adherence to regulatory standards. Continued
            diligence and strategic management are recommended to maintain these
            standards and to proactively address any potential challenges.
          </p>
        </section>
        <div className="report-content mt-1">
          <p
            style={{
              fontSize: "12px",
              color: "gray",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            *** This is a computer-generated report and does not require a
            physical signature. ***
          </p>
          <div className="mt-6 text-justify">
            <p style={{ fontSize: "12px", color: "gray" }}>
              <em>
                Disclaimer: This payout report is confidential and intended
                solely for the designated recipient(s). Any unauthorized
                dissemination, distribution, copying, or use of this report or
                its contents is strictly prohibited. The information contained
                herein is provided "as is" without any warranties of any kind,
                either express or implied. The information contained in this
                report has been processed and reconciled with due professional
                care; however, Treyst Infotech Pvt Ltd makes no representations
                or warranties as to the accuracy or completeness of the data
                provided by external sources. Any decisions made based on this
                report are the sole responsibility of the recipient(s). Treyst
                Infotech Pvt Ltd accepts no liability for any direct, indirect,
                or consequential losses or damages arising from the use of this
                report or its contents.
              </em>
            </p>
          </div>
        </div>
        {/* Footer */}
        {/* <footer className="text-gray-500 text-sm mt-12 border-t-2 border-orange-200 pt-6"> */}
        {/* <div className="flex justify-between items-center"> */}
        {/* Left side - Copyright */}
        {/* <div>© 2024, Treyst Infotech Pvt Ltd, All Rights Reserved</div> */}

        {/* Right side - Printed Date/Time and IP Address */}
        {/* <div>
              Printed on: {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}{" "}
              {ipAddress && <span> Using IP Address: {ipAddress}</span>}
            </div>
          </div> */}
        {/* </footer> */}
      </div>
    </div>
  );
};

export default PayoutAnalysisReport;
