import React from "react";

const steps = [
  { title: "Personal Info", icon: "check", description: "Step details here" },
  { title: "Account Info", icon: "account", description: "Step details here" },
  { title: "Review", icon: "review", description: "Step details here" },
  { title: "Confirmation", icon: "confirm", description: "Step details here" },
];

const StepIcon = ({ icon, isCompleted }) => {
  const icons = {
    check: (
      <svg
        className="w-3.5 h-3.5 text-green-500 dark:text-green-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 12"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 5.917 5.724 10.5 15 1.5"
        />
      </svg>
    ),
    account: (
      <svg
        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 16"
      >
        <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
      </svg>
    ),
    review: (
      <svg
        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 20"
      >
        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
      </svg>
    ),
    confirm: (
      <svg
        className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 20"
      >
        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
      </svg>
    ),
  };
  return isCompleted ? icons[icon] : icons[icon];
};

const ProgressSteps = ({ currentStep }) => {
  return (
    <ol className="flex space-x-8 text-gray-500 dark:text-gray-400">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <li key={step.title} className="relative">
            <span
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white dark:ring-gray-900 ${
                isCompleted
                  ? "bg-green-200 dark:bg-green-900"
                  : "bg-gray-100 dark:bg-gray-700"
              } -left-4`}
            >
              <StepIcon icon={step.icon} isCompleted={isCompleted} />
            </span>
            <h3
              className={`font-medium leading-tight ${
                isCurrent ? "text-blue-600" : ""
              }`}
            >
              {step.title}
            </h3>
            <p className="text-sm">{step.description}</p>
          </li>
        );
      })}
    </ol>
  );
};

export default ProgressSteps;
