import React, { useEffect, useState } from "react";
import { getCircular } from "../../api/userapi";
import { FaDownload } from "react-icons/fa";

export function Circular() {
  const [circular, setCircular] = useState([]);

  useEffect(() => {
    const fetchCircular = async () => {
      try {
        const response = await getCircular();
        if (response.status === 200) {
          const data = response.data.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
          });
          setCircular(data); 
          // console.log(data); circular data 
        } else {
          console.error("Failed to fetch circulars");
        }
      } catch (err) {
        console.error("Error fetching circulars: ", err.message);
      }
    };

    fetchCircular();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-7 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
        Circular
      </h1>

      <ul className="space-y-4 max-h-[480px] pr-3 overflow-y-auto relative">
        {circular.length > 0 ? (
          circular.map((item, index) => (
            <li
              key={index}
              className="p-4 bg-gradient-to-r from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {item.message}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex gap-2">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 dark:text-orange-400 hover:underline "
                      >
                        Know more
                      </a>
                    )}
                    {item.pdfurl && (
                      <a
                        href={item.pdfurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 dark:text-orange-400 hover:underline"
                      >
                        <FaDownload className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.date ? item.date : item.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 bg-gradient-to-r from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center justify-center w-full">
              <p className="text-center text-xl text-gray-700 dark:text-gray-300">
                No circulars available
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Circular;
