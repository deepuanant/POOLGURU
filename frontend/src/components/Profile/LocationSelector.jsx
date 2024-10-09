import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const LocationSelector = ({ initialCountry, initialState, initialCity, onLocationChange }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [countryISO, setCountryISO] = useState('');
    const [stateISO, setStateISO] = useState('');

    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

    const [countrySearch, setCountrySearch] = useState('');
    const [stateSearch, setStateSearch] = useState('');
    const [citySearch, setCitySearch] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch("https://api.countrystatecity.in/v1/countries", {
                method: 'GET',
                headers: {
                    "X-CSCAPI-KEY": "UUpjcms1RExCVXVMSnIxekpXbm4zbG51b1BXYmRnd2NTazhjeW5waA=="
                }
            });
            const data = await response.json();
            setCountries(data);

            // Set selectedCountry name and ISO code from initialCountry
            if (initialCountry) {
                const selected = data.find(c => c.name === initialCountry);
                if (selected) {
                    setSelectedCountry(selected.name);
                    setCountryISO(selected.iso2);
                    fetchStates(selected.iso2);
                }
            }
        };

        fetchCountries();
    }, [initialCountry]);

    // Fetch states based on selected country's ISO code
    const fetchStates = async (countryIso) => {
        const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryIso}/states`, {
            method: 'GET',
            headers: {
                "X-CSCAPI-KEY": "UUpjcms1RExCVXVMSnIxekpXbm4zbG51b1BXYmRnd2NTazhjeW5waA=="
            }
        });
        const data = await response.json();
        setStates(data);

        // Set selectedState name and ISO code from initialState
        if (initialState) {
            const selected = data.find(s => s.name === initialState);
            if (selected) {
                setSelectedState(selected.name);
                setStateISO(selected.iso2);
                fetchCities(countryIso, selected.iso2);
            }
        }
    };

    // Fetch cities based on selected state's ISO code
    const fetchCities = async (countryIso, stateIso) => {
        const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryIso}/states/${stateIso}/cities`, {
            method: 'GET',
            headers: {
                "X-CSCAPI-KEY": "UUpjcms1RExCVXVMSnIxekpXbm4zbG51b1BXYmRnd2NTazhjeW5waA=="
            }
        });
        const data = await response.json();
        setCities(data);

        // Set selectedCity from initialCity
        if (initialCity) {
            const selected = data.find(c => c.name === initialCity);
            if (selected) {
                setSelectedCity(selected.name);
            }
        }
    };

    const handleCountryChange = async (countryName) => {
        const selectedCountry = countries.find(c => c.name === countryName);
        if (selectedCountry) {
            setSelectedCountry(selectedCountry.name);
            setCountryISO(selectedCountry.iso2);
            setSelectedState('');
            setSelectedCity('');
            setStates([]);
            setCities([]);
            setIsCountryDropdownOpen(false);
            setCountrySearch(''); // Reset search input on selection
            fetchStates(selectedCountry.iso2);
        }
    };

    const handleStateChange = async (stateName) => {
        const selectedState = states.find(s => s.name === stateName);
        if (selectedState) {
            setSelectedState(selectedState.name);
            setStateISO(selectedState.iso2);
            setSelectedCity('');
            setCities([]);
            setIsStateDropdownOpen(false);
            setStateSearch(''); // Reset search input on selection
            fetchCities(countryISO, selectedState.iso2);
        }
    };

    const handleCityChange = (cityName) => {
        if (!countryISO || !stateISO) {
            toast.error('Please select country and state first!');
            return;
        }

        setSelectedCity(cityName);
        setIsCityDropdownOpen(false);
        setCitySearch(''); // Reset search input on selection
        const location = `${cityName}, ${selectedState}, ${selectedCountry}`;
        onLocationChange(location);
    };

    const handleSearch = (e, setSearch, list) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        const matchedItem = list.find(item => item.name.toLowerCase().startsWith(query));
        if (matchedItem) {
            document.getElementById(matchedItem.iso2 || matchedItem.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4 gap-y-2">
            {/* Country Dropdown */}
            <div className="relative w-full">
                <button
                    id="dropdownCountryButton"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-between items-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <span>{selectedCountry || 'Select Country'}</span>
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                {isCountryDropdownOpen && (
                    <div className="relative">
                        <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => handleSearch(e, setCountrySearch, countries)}
                            placeholder="Type to search..."
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                        <div
                            id="dropdown"
                            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 absolute mt-1 max-h-44 overflow-y-auto"
                        >
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCountryButton">
                                {countries
                                    .filter(country => country.name.toLowerCase().startsWith(countrySearch))
                                    .map(country => (
                                        <li key={country.iso2} id={country.iso2}>
                                            <button
                                                onClick={() => handleCountryChange(country.name)}
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                                            >
                                                {country.name}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* State Dropdown */}
            <div className="relative w-full">
                <button
                    id="dropdownStateButton"
                    onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-between items-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <span>{selectedState || 'Select State'}</span>
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                {isStateDropdownOpen && (
                    <div className="relative">
                        <input
                            type="text"
                            value={stateSearch}
                            onChange={(e) => handleSearch(e, setStateSearch, states)}
                            placeholder="Type to search..."
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                        <div
                            id="dropdown"
                            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 absolute mt-1 max-h-52 overflow-y-auto"
                        >
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownStateButton">
                                {states
                                    .filter(state => state.name.toLowerCase().startsWith(stateSearch))
                                    .map(state => (
                                        <li key={state.iso2} id={state.iso2}>
                                            <button
                                                onClick={() => handleStateChange(state.name)}
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                                            >
                                                {state.name}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* City Dropdown */}
            <div className="relative w-full">
                <button
                    id="dropdownCityButton"
                    onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex justify-between items-center w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <span>{selectedCity || 'Select City'}</span>
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                {isCityDropdownOpen && (
                    <div className="relative">
                        <input
                            type="text"
                            value={citySearch}
                            onChange={(e) => handleSearch(e, setCitySearch, cities)}
                            placeholder="Type to search..."
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                        <div
                            id="dropdown"
                            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 absolute mt-1 max-h-52 overflow-y-auto"
                        >
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCityButton">
                                {cities
                                    .filter(city => city.name.toLowerCase().startsWith(citySearch))
                                    .map(city => (
                                        <li key={city.id} id={city.id}>
                                            <button
                                                onClick={() => handleCityChange(city.name)}
                                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                                            >
                                                {city.name}
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationSelector;
