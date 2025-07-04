import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SidebarCard from '../components/sidebar/SidebarCard'
import Homecontext from '../components/Home/Homecontext'


const MainPage = () => {
  return (
    <>
    <section className='w-full h-screen bg-[#1928cd] flex '>
     <Navbar/>

    <div className='w-full h-[80vh]  flex flex-col items-center justify-center bg-amber-300'>
      <SidebarCard/>
      <Homecontext/>
    </div>
    </section>
    
    </>
  )
}

export default MainPage
