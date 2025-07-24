
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Cards from './Cards'

const Mypage = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen)
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)


  //user shortname
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  // Avatar display logic
  const renderAvatar = () => {
    if (!isLoggedIn) {
      return <span className="text-sm">?</span>;
    }
    
    // For Google users with avatar image
    if (user.avatar) {
      return (    
        <p>{user.avatar}</p>
      );
    }
    
    // For regular users - show initials
    const initials = user.username 
      ? user.username.slice(0, 2).toUpperCase()
      : "US";
    
    return <span className="text-sm">{initials}</span>;
  };

  return (
    <section className={`w-full ${isSidebarOpen ? 'lg:ml-[45vh]' : ''} lg:ml-8 mt-20`}>
      {/* YouTube-style navigation tabs */}
      

      {/* Your original channel header section */}
      <div className={`h-44 w-full  ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center px-28`}>
        <div className="flex items-center space-x-6 max-w-4xl w-full">
          <div className={`h-24 w-24 rounded-full border-2 flex items-center justify-center text-2xl font-bold`}>
            {renderAvatar()}
          </div>
          <div className="flex-1">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Shad0w_Edit0r</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>@shadow-52I</p>
            <div className="flex items-center space-x-4 mt-2">
              {/* <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>3.18K subscribers</p> */}
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>124 videos</p>
            </div>
            {/* <button className={`mt-3 px-4 py-1 rounded-full ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} text-sm font-medium transition-colors`}>
              Subscribe
            </button> */}
          </div>
        </div>
      </div>
      <div className={`flex mb-4 ${isSidebarOpen ? 'lg:ml-[10vh]' : 'ml-20'}  ${isDarkMode ? 'border-gray-200' : 'border-gray-800'} px-8`}>
        
        <Link 
          
          className={`p-2 flex items-center justify-center  font-medium ${isDarkMode ? 'text-white' : 'text-black'} border-b-2  hover:border-gray-400`}
        >
          Shorts
        </Link>
      </div>

      {/* Your original videos grid section */}
      <div className="lg:flex lg:flex-wrap justify-center items-center gap-4 p-4 w-full grid grid-cols-2 md:grid-cols-3 md:items-center">
     
          <Cards/>
      </div>
    </section>
  )
}

export default Mypage