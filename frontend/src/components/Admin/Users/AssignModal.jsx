// Assuming you have a list of all available services
const allServicesList = [
  "Pool Scrubbing",
  "Payout Monitoring",
  "Loss Estimation",
  "Pool Reconciliation",
  "Direct Assignment",
  "Co Lending",
  "Securitization",
];

const AssignpagesModal = ({
  selectedServices,
  defaultServices,
  onServiceChange,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-lg font-bold mb-4">Update Services</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Services:</label>
          <div className="flex flex-col">
            {allServicesList.map((service) => (
              <label key={service} className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  value={service}
                  checked={selectedServices.includes(service)}
                  onChange={onServiceChange}
                  className="form-checkbox text-blue-600"
                />
                <span className="ml-2">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignpagesModal;
