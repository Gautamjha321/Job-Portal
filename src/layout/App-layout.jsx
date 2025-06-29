import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Applayout() {
  return (
    <div>
      <div className='grid-background'></div>

      <main className='min-h-screen container ' >
        <Header/>

<Outlet/>
      </main>
      <div className='p-10 text-center bg-gray-800 mt-10'> Made With ❤️ By  Gautam Jha</div>
      
    </div>
  )
}

export default Applayout