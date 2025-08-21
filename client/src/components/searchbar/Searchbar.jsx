
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { searchVideos } from "../../service/video.Service.js";
import { Link } from "react-router-dom";

const Searchbar = ({ isOpen, onClose, searchQuery, onSearchChange }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const searchbarRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        searchbarRef.current &&
        !searchbarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (localQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch(localQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [localQuery]);

  const performSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchVideos(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    onSearchChange(query);
  };

  const handleVideoSelect = () => {
    onClose();
    setLocalQuery("");
    onSearchChange("");
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 lg:right-44 flex justify-center pt-20 px-4`}
    >
      <div
        ref={searchbarRef}
        className={`w-full md:max-w-[900px] lg:max-w-[500px] h-96 bg-white rounded-lg shadow-xl p-4 border border-gray-300 dark:border-gray-600 ${
          isDarkMode ? "dark:bg-[#000000f8]" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium ">
            Search Videos
          </h3>
          <button
            onClick={onClose}
           className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          >
            ✕
          </button>
        </div>
        
     

        {/* Search results */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-center dark:text-white py-4">Loading...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((video) => (
              <Link
                key={video._id}
                to={`/video/${video._id}`}
                onClick={handleVideoSelect}
              >
                <div className="flex items-center p-3 bg-[#303030] rounded cursor-pointer transition-colors duration-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {video.description}
                    </p>
                    
                  </div>
                </div>
              </Link>
            ))
          ) : localQuery.trim() ? (
            <div className="text-center dark:text-white py-4">
              No videos found matching "{localQuery}"
            </div>
          ) : (
            <div className="text-center dark:text-white py-4">
              Type to search videos by description
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;