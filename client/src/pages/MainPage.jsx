import React from 'react'
import Navbar from '../components/Navandside/Navbar'
import SidebarCard from '../components/Navandside/SidebarCard'
import Homecontext from '../components/Home/Homecontext'


const MainPage = () => {
  return (
    <>
      <Navbar/>

        <div className='w-full h-full  flex flex-col items-center justify-center'>
      <SidebarCard/>
      <Homecontext/>
        </div>
    </>
  )
}

export default MainPage
