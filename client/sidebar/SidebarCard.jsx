import React from 'react';
import { FaHome, FaCompass, FaSubscript } from "react-icons/fa";

const SidebarCard = () => {
  return (
    <>
    <section className='p-4 mx-6'>
      <aside className="fixed top-24 left-0 bottom-0 w-64 bg-red-500">
        {/* Primary Section */}
        <div className="py-3 border-b border-gray-200">
          <a href="#" className="flex items-center px-6 py-2 hover:bg-gray-100">
            <FaHome className="text-gray-600 mr-6 text-xl" />
            <span className="text-sm font-medium">Home</span>
          </a>
          <a href="#" className="flex items-center px-6 py-2 hover:bg-gray-100">
            <FaCompass className="text-gray-600 mr-6 text-xl" />
            <span className="text-sm font-medium">Explore</span>
          </a>
          <a href="#" className="flex items-center px-6 py-2 hover:bg-gray-100">
            <FaSubscript className="text-gray-600 mr-6 text-xl" />
            <span className="text-sm font-medium">Subscriptions</span>
          </a>
        </div>
        
       
      </aside>
      </section>
    </>
  );
};

export default SidebarCard;
// overflow-y-auto transform transition-transform duration-300 ease-in-out z-40  md:translate-x-0