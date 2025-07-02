import React from 'react'
import Sidebar from './Sidebar'
import logo from "../../../public/youtube.svg"

const Navbar = () => {
  return (
    <>

    <section>
      <div className='flex gap-4 p-4'>
      <div><Sidebar/></div>
      <div>
        <img src={logo} alt="" className='h-10 w-10'/>
      </div>
      <div></div>
      <div></div>
      <div></div>
      </div>
    </section>
      
    </>
  )
}

export default Navbar
