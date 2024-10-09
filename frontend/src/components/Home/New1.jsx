import React from "react";
import { getnewsfromyahoo } from "../../api/userapi";
import { useState, useEffect } from "react";

// Function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

// React component to display news in a list layout with forced scrolling
const NewsComponent = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getnewsfromyahoo();
        if (response.status === 200) {
          // console.log(response); news data
          const limitedNews = response.data.data.slice(0, 10);
          setNews(limitedNews);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
        Latest News
      </h1>
      <div className="h-[490px] overflow-y-auto relative scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-100">
        <ul className="space-y-4 pr-3">
          {news.map((item, index) => (
            <li
              key={index}
              className="p-4 bg-gradient-to-r from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 "
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <img
                    className="w-16 h-16 rounded-full border-2 border-orange-200"
                    src={item.img}
                    alt={item.title}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900 truncate dark:text-white">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {truncateText(item.text, 80)}
                  </p>
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="text-orange-500 font-semibold">
                      {item.source}
                    </span>{" "}
                    | <span>{item.ago}</span>
                  </div>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NewsComponent;
