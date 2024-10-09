import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const FloatingActionButton = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.floatingButtonWrap')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="floatingButtonWrap fixed bottom-4 right-4 z-50">
      <div className="floatingButtonInner relative">
        <button
          onClick={toggleMenu}
          className={`floatingButton w-12 h-12 flex items-center justify-center bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-full border-4 border-blue-200 transition-opacity duration-400 ${isOpen ? 'opacity-100' : 'opacity-100'
            }`}
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaPlus className="text-xl" />}
        </button>
        <ul
          className={`floatingMenu absolute bottom-16 right-0 transition-all duration-400 ${isOpen ? 'block' : 'hidden'
            }`}
        >
          {navItems.map((item, index) => (
            <li key={index} className="mb-1 text-right">
              <a
                href={item.path}
                className="block px-4 py-2 bg-blue-100 text-blue-700 rounded shadow hover:mr-2 transition-all duration-400 whitespace-nowrap"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FloatingActionButton;
