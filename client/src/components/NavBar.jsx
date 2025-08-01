import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {

  const navigate = useNavigate();

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-4 sm:px-20 absolute top-0'>

       <div className='flex items-center gap-2 sm:gap-1'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32' /><span className=' text-gray-800 font-semibold sm:text-5xl text-3xl pt-3'>MernAuth</span>
        </div>

        <button 
        onClick={() => navigate('/login')}
        className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt='' /></button>
    </div>
  )
}

export default NavBar