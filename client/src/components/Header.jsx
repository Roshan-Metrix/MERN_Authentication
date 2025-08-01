import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {

  const { userData } = useContext(AppContent)

  return (
    <div className='flex flex-col items-center m-20 px-4 text-center text-grey-800'>
        <img src={assets.header_img} alt="" className='w-50 h-64 rounded-3xl mb-1 hover:-scale-x-125 transition duration-700' />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}!
          <img className='w-8 aspect-square' src={assets.hand_wave} alt='' />
        </h1>

        <h2 className='text-3xl sm:text-5xl  font-semibold mb-4'>Welcome To Our MernAuth</h2>

        <p className='mb-8 max-w-md'>Explore the features and enjoy a seamless experience with our platform!</p>

        <button className='border border-grey-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header