import React, { useState } from 'react';

const FilterDropdown = ({ title, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="relative">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {selectedOption || `Select ${title}`}
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
              }}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSection = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Seasoning Filter</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Exclude Restructured Loans</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Exclude Loans under Moratorium</span>
        </label>
      </div>
      <FilterDropdown title="Concentration Threshold" options={['Low', 'Medium', 'High']} />
      <FilterDropdown title="Limit Pool Size" options={['Small', 'Medium', 'Large']} />
      <FilterDropdown title="Geography" options={['North', 'South', 'East', 'West']} />
      <FilterDropdown title="Exclude Overlapping Contracts" options={['Yes', 'No']} />
      <FilterDropdown title="Custom Filter" options={['Option 1', 'Option 2', 'Option 3']} />
      <FilterDropdown title="Pivots" options={['Pivot 1', 'Pivot 2', 'Pivot 3']} />
      <FilterDropdown title="Tenor" options={['Short', 'Medium', 'Long']} />
    </div>
  );
};

export default FilterSection;
