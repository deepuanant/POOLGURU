import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaQuestionCircle, FaShieldAlt } from "react-icons/fa";

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => (
  <div className="mb-2 rounded-lg border bg-white dark:bg-gray-800 shadow-md">
    <button
      className="flex w-full items-center justify-between rounded-t-lg bg-gray-100 p-4 text-left hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition transform hover:-translate-y-1 hover:scale-105"
      onClick={toggleOpen}
      aria-expanded={isOpen}
      aria-controls={`answer-${question.replace(/\s+/g, "-")}`}
    >
      <span>{question}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && (
      <div id={`answer-${question.replace(/\s+/g, "-")}`} className="p-4">
        {answer || "No answer available at the moment."}
      </div>
    )}
  </div>
);

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const generalQuestions = [
    {
      question: "What is Pool Scrubbing in finance?",
      answer:
        "Pool Scrubbing involves the process of data cleansing, loan verification, and ensuring the asset quality meets compliance standards before including loans in a pool for securitization or other financial purposes.",
    },
    {
      question: "How is Loan Verification conducted during Pool Scrubbing?",
      answer:
        "Loan Verification includes validating the borrower's information, ensuring the loan documents are complete, and confirming that the loan meets the eligibility criteria set by the financial institution.",
    },
    {
      question: "What is the importance of Data Accuracy in Pool Scrubbing?",
      answer:
        "Data Accuracy is crucial to ensure that all information regarding loans and borrowers is correct, which helps in accurate risk assessment, compliance checks, and maintaining the integrity of the loan pool.",
    },
    {
      question: "How does Risk Assessment work in Pool Scrubbing?",
      answer:
        "Risk Assessment involves evaluating the creditworthiness of borrowers, assessing the default risk, and determining the overall risk profile of the loan pool to ensure that it meets the desired standards of the institution.",
    },
    {
      question: "What is involved in Collateral Appraisal?",
      answer:
        "Collateral Appraisal is the process of evaluating the value of the collateral securing a loan to ensure it is sufficient to cover the loan amount in case of borrower default.",
    },
    {
      question: "What is Payment Reconciliation in Payout Monitoring?",
      answer:
        "Payment Reconciliation involves matching the payments received from borrowers with the amounts due, ensuring that principal and interest payments are correctly accounted for and discrepancies are resolved.",
    },
    {
      question: "Why is Default Monitoring important in Payout Monitoring?",
      answer:
        "Default Monitoring helps in tracking borrowers who have missed payments, allowing timely intervention and strategies to manage and mitigate potential losses.",
    },
    {
      question: "What is a Remittance Report?",
      answer:
        "A Remittance Report provides a detailed account of the payments collected from borrowers and disbursed to investors, ensuring transparency and accurate financial reporting.",
    },
    {
      question: "How is Loss Given Default calculated in Loss Estimation?",
      answer:
        "Loss Given Default (LGD) is calculated by assessing the amount of loss a lender incurs when a borrower defaults, considering the recovery rate from collateral and other sources.",
    },
    {
      question: "What is the role of Stress Testing in Loss Estimation?",
      answer:
        "Stress Testing involves simulating adverse economic scenarios to evaluate the impact on loan performance and estimate potential losses under extreme conditions.",
    },
    {
      question: "How does Pool Reconciliation ensure Data Validation?",
      answer:
        "Pool Reconciliation ensures Data Validation by verifying the accuracy and completeness of borrower information, transaction details, and cash flows, maintaining the integrity of the loan pool.",
    },
    {
      question: "What is the purpose of an Audit Trail in Pool Reconciliation?",
      answer:
        "An Audit Trail provides a detailed record of all transactions and changes made to the loan pool, facilitating transparency and accountability in financial reporting.",
    },
    {
      question: "What is Direct Assignment in finance?",
      answer:
        "Direct Assignment refers to the transfer of loans or assets from one financial institution to another, often involving the sale of loan portfolios or securitization processes.",
    },
    {
      question: "What is a Special Purpose Vehicle (SPV) in Direct Assignment?",
      answer:
        "An SPV is a separate legal entity created to handle specific financial transactions, such as securitization, isolating financial risk from the parent company.",
    },
    {
      question: "What is Co-lending?",
      answer:
        "Co-lending is a collaborative lending arrangement where two or more lenders, typically a bank and an NBFC, jointly lend to borrowers, sharing the risks and rewards.",
    },
    {
      question: "How does Risk Sharing work in Co-lending?",
      answer:
        "Risk Sharing in Co-lending involves distributing the credit risk between the participating lenders based on their agreement, which can help in mitigating individual exposure to loan defaults.",
    },
    {
      question: "What are Asset-Backed Securities in Securitization?",
      answer:
        "Asset-Backed Securities (ABS) are financial instruments backed by a pool of assets, such as loans, leases, credit card debt, or receivables, providing investors with income from the underlying assets.",
    },
    {
      question: "What is Credit Enhancement in Securitization?",
      answer:
        "Credit Enhancement refers to techniques used to improve the credit quality of securitized assets, such as over-collateralization, reserve funds, or guarantees, making them more attractive to investors.",
    },
    {
      question: "What is the purpose of a Tranche in Securitization?",
      answer:
        "A Tranche is a portion of a securitized debt offering that is divided into different levels of risk and return, allowing investors to choose according to their risk appetite.",
    },
    {
      question: "What are Pass-Through Certificates (PTCs)?",
      answer:
        "Pass-Through Certificates (PTCs) are securities representing a share in a pool of assets, where the principal and interest payments from the underlying assets are passed through to the certificate holders.",
    },
  ];

  const privacyQuestions = [
    {
      question: "How do you protect my data?",
      answer:
        "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.",
    },
    {
      question: "Do you share my information with third parties?",
      answer:
        "We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users.",
    },
    {
      question: "Can I opt out of data collection?",
      answer:
        "Yes, you can opt out of data collection. We provide various options to manage your data preferences and will inform you how to do so through our privacy settings or by contacting us directly.",
    },
    {
      question: "How can I ensure the security of my account?",
      answer:
        "To ensure the security of your account, use a strong and unique password, enable two-factor authentication, and avoid sharing your login credentials with others.",
    },
    {
      question: "What types of personal data do you collect?",
      answer:
        "We may collect personal data such as names, addresses, phone numbers, birthdates, social security numbers, tax identification numbers, national insurance numbers, and financial account numbers.",
    },
    {
      question: "How long do you retain my personal data?",
      answer:
        "We will retain your personal data only for as long as necessary to provide the services. We may also retain and use your personal data to comply with legal obligations, resolve disputes, and enforce our agreements and policies.",
    },
    {
      question: "What happens if there is a data breach?",
      answer:
        "If we suspect a data breach involving your personal information, we will immediately investigate and take appropriate action as outlined in our Incident Response Plan (IRP). We will also notify affected individuals and regulatory authorities as required by law.",
    },
    {
      question: "What are my rights regarding my personal data?",
      answer:
        "You have the right to access, correct, delete, or object to the processing of your personal data. You can contact us to exercise these rights or for any inquiries regarding your data.",
    },
    {
      question: "How can I contact you about privacy concerns?",
      answer:
        "If you have any questions or concerns about our Privacy Policy, you can contact our Compliance Team at support@treystinfotech.com or call us at _________________.",
    },
    {
      question: "Do you process child data?",
      answer:
        "No, we do not process any child data either directly or indirectly.",
    },
    {
      question: "Do you transfer data outside of India's jurisdiction?",
      answer:
        "Currently, we do not transfer any client data out of India's jurisdictions.",
    },
    {
      question: "What personal information is collected without my knowledge?",
      answer:
        "We reserve the right to collect and process personal information in the course of providing services to our clients without the knowledge of individuals involved, especially within the Indian region.",
    },
    {
      question:
        "Under what circumstances will you disclose my personal information?",
      answer:
        "As a general rule, we will not disclose personally identifiable information except when required by customer agreement, law, or other circumstances outlined in our Privacy Policy.",
    },
    {
      question: "How do you handle fraud prevention?",
      answer:
        "We may share information with governmental agencies or other companies assisting in fraud prevention or investigation. This information is not provided to these companies for marketing purposes.",
    },
    {
      question: "How often is the Privacy Policy reviewed and updated?",
      answer:
        "This Privacy Policy is reviewed annually and updated as necessary to comply with applicable regulations and laws. We will post any revised Privacy Policy on our website or application.",
    },
    {
      question:
        "Do you comply with Information Technology and other regulatory rules?",
      answer:
        "Yes, we comply with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011; the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021; the Guidelines on Digital Lending issued by the Reserve Bank of India (RBI), 2022; and all other applicable acts, regulations, and rules.",
    },
    {
      question: "Do you have agreements with third-party vendors?",
      answer:
        "Yes, we have non-disclosure agreements (NDA) and/or data processing agreements (DPA) with third-party vendors to ensure that the personal data of our clients is secured and processed as per the agreements.",
    },
    {
      question: "How do you handle user communications?",
      answer:
        "When a visitor sends an email or other communication to us, these communications may be retained to process inquiries, respond to requests, and improve our services.",
    },
    {
      question: "What are the legal bases for processing my personal data?",
      answer:
        "We process your personal data based on your consent, to fulfill a contract, to comply with legal obligations, and to protect your vital interests or those of others.",
    },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700 flex flex-col">
        <div className="w-screen-xl mx-auto p-10 flex-grow text-center">
          <h3 className="mb-2 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
            Frequently Asked Questions
          </h3>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
            If you cannot find the answer to your question in our FAQ, <br />
            you can always contact us. We will respond shortly !!
          </p>
          <div className="w-screen-md mx-auto border p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="h-96 overflow-y-auto">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 z-10">
                  General Questions{" "}
                  <FaQuestionCircle className="ml-2 text-orange-600" />
                </h2>

                {generalQuestions.map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItem === `general${index}`}
                    toggleOpen={() => toggleItem(`general${index}`)}
                  />
                ))}
              </div>
              <div className="h-96 overflow-y-auto">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 z-10">
                  Privacy & Security{" "}
                  <FaShieldAlt className="ml-2 text-orange-600" />
                </h2>

                {privacyQuestions.map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openItem === `privacy${index}`}
                    toggleOpen={() => toggleItem(`privacy${index}`)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center space-x-4 p-4 bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 px-5 py-3 text-center text-sm font-medium hover:bg-orange-400 focus:ring-4 focus:ring-orange-200 transition transform hover:-translate-y-1 hover:scale-105"
            >
              <i className="mdi mdi-home mr-2"></i>Back to home
            </Link>
            <Link
              to="/contactus"
              className="inline-flex items-center justify-center rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 px-5 py-3 text-center text-sm font-medium hover:bg-orange-400 focus:ring-4 focus:ring-orange-200 transition transform hover:-translate-y-1 hover:scale-105"
            >
              <i className="mdi mdi-email mr-2"></i>Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
