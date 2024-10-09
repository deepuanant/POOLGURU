import React, { useRef } from "react";
import PoolScrubbing from "../components/services/PoolScrubbing";
import Colending from "../components/services/Colending";
import DirectAssignment from "../components/services/DirectAssignment";
import LossEstimation from "../components/services/LossEstimation";
import PayoutMonitoring from "../components/services/PayoutMonitoring";
import PassThroughCertificate from "../components/services/PassThroughCertificate";
import PoolReconciliation from "../components/services/PoolReconciliation";
import ServiceCarousel from "../components/services/ServiceCarousel";

function Services() {
  const poolScrubbingRef = useRef(null);
  const colendingRef = useRef(null);
  const directAssignmentRef = useRef(null);
  const lossEstimationRef = useRef(null);
  const payoutMonitoringRef = useRef(null);
  const PassThroughCertificateRef = useRef(null);
  const poolReconciliationRef = useRef(null);

  const serviceRefs = {
    "Pool Scrubbing": poolScrubbingRef,
    "Payout Monitoring": payoutMonitoringRef,
    "Loss Estimation": lossEstimationRef,
    "Pool Reconciliation": poolReconciliationRef,
    "Direct Assignment": directAssignmentRef,
    "Co lending": colendingRef,
    "Pass-Through Certificate": PassThroughCertificateRef,
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ServiceCarousel serviceRefs={serviceRefs} />
      <div className="flex-1">
        <div ref={poolScrubbingRef} className="p-3">
          <PoolScrubbing />
        </div>
        <div ref={payoutMonitoringRef} className="p-3">
          <PayoutMonitoring />
        </div>
        <div ref={poolReconciliationRef} className="p-3">
          <PoolReconciliation />
        </div>
        <div ref={lossEstimationRef} className="p-3">
          <LossEstimation />
        </div>
        <div ref={directAssignmentRef} className="p-3">
          <DirectAssignment />
        </div>
        <div ref={colendingRef} className="p-3">
          <Colending />
        </div>
        <div ref={PassThroughCertificateRef} className="p-3">
          <PassThroughCertificate />
        </div>
      </div>
    </div>
  );
}

export default Services;
