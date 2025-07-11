// import React from 'react'

// const Searchbar = () => {
//   return (
//     <>
//       <div className='min-h-40 w-[400px] bg-amber-100'>

//       </div>
//     </>
//   )
// }

// export default Searchbar

import React from 'react'

const Searchbar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed top-20 left-1/2 transform -translate-x-1/2 min-h-40 w-[500px] bg-white dark:bg-[#212121] rounded-lg shadow-xl z-50 p-4 border border-gray-300 dark:border-gray-600'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-medium dark:text-white'>Recent searches</h3>
        <button 
          onClick={onClose}
          className='text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
        >
          ✕
        </button>
      </div>
      <div className='space-y-2'>
        <div className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#303030] rounded cursor-pointer'>
          <span className='text-gray-600 dark:text-gray-300'>React tutorials</span>
        </div>
        <div className='flex items-center p-2 hover:bg-gray-100 dark:hover:bg-[#303030] rounded cursor-pointer'>
          <span className='text-gray-600 dark:text-gray-300'>Redux toolkit</span>
        </div>
      </div>
    </div>
  )
}

export default Searchbar
