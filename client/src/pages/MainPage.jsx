import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SidebarCard from '../components/sidebar/SidebarCard'
import Homecontext from '../components/Home/Homecontext'
import { Route,Routes } from 'react-router-dom'


const MainPage = () => {
  return (
    <>
    {/* <Navbar/> */}

  
    <section className='w-full min-h-screen bg-[#b1b2c2] pt-[15vh] flex'>
    
      <SidebarCard/>
     
      <Homecontext/>
    
    </section>
    
    </>
  )
}

export default MainPage



