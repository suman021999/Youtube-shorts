import React from 'react'

import logo from "../../../public/youtube.svg"
import { CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { RxHamburgerMenu } from 'react-icons/rx';
const Navbar = () => {
  //   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };
  return (
    <>

    <section className='fixed w-full h-[10vh] mb-4 bg-amber-200'>


       <div className='flex gap-4 p-4 mx-6 items-center justify-between'>

        <div className='flex gap-4 items-center'>
        <div><RxHamburgerMenu className='h-6 w-6'/></div>

        <div>
          <img src={logo} alt="" className='h-10 w-10'/>
        </div>
       </div>
      

      <div>
        <div className='flex items-center'>
          <input type="text" name="search" id="search" placeholder='search' className='w-[500px] h-15 px-8 border-1 border-[#9e9898d6]
           rounded-l-4xl hover:shadow-[inset_0_0_6px_#1e90ff] ' />
          <div className='flex py-4 border-1 rounded-r-4xl w-[100px] h-15 items-center justify-center bg-[#e4dede57] hover:bg-[#cccaca95] border-[#9e9898d6]'>
           <CiSearch className='w-6 h-6'/>
          </div>
        </div>
      </div>



      <div className='flex gap-4 items-center'>

      <div className='bg-[#d4d0d079] hover:bg-[#a4a1a179] px-4 py-2 rounded-4xl flex items-center gap-2'>
        <GoPlus />
        Create
      </div>

      <div>
        <div className='w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full'>BE</div>
      </div>
      </div>


      </div>
     
        
    </section>

    </>
  )
}

export default Navbar



