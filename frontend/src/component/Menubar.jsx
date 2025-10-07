import React from 'react'
import Story from './story'
import Video from './Video'
import { useContext } from 'react'
import { UserContext } from './Contextapi'
const Menubar = () => {
  const { detail }= useContext(UserContext)

  const image = detail?.user?.profile?.image
  return (
    <div >
      <div className='sm:w-30 w-15 sm:h-auto h-screen border-1 border-gray-300 flex flex-col items-center'>
          <img className='sm:w-16 w-13 sm:h-16 h-13 mt8' src="/logo1.png" alt="" />
        <a href="/dashboard" smooth={true} duration={500}>
        <div className='sm:mt-15 mt-25 flex flex-col justify-center items-center gap-2'>
          <img className='w-5 h-5' src="/Home.png" alt="" />
          <p className='sm:text-[13px] text-[10px] sm:font-[700] font-[400] '>Home</p>
        </div>
        </a>
        <a href="#">
        <div className='sm:mt-7 mt-8 flex flex-col justify-center items-center gap-2'>
          <img className='w-8 h-8' src="/searchicon.png" alt="" />
          <p className='sm:text-[13px] text-[10px] sm:font-[700] font-[400] '>Search</p>
        </div>
        </a>
        <a href="">
        <div className='sm:mt-7 mt-8 flex flex-col justify-center items-center gap-2'>
          
          <img className='w-7 h-7' src="/reel.png" alt="" />
          <p className='sm:text-[13px] text-[10px] sm:font-[700] font-[400] '>Reels</p>
        </div>
        </a>
        <a href="/message">
        <div className='sm:mt-7 mt-8 flex flex-col justify-center items-center gap-2'>
          <img className='w-5 h-5' src="/paper-plane.png" alt="" />
          <p className='sm:text-[13px] text-[10px] sm:font-[700] font-[400] '>message</p>
        </div>
        </a>
        <a href="/posts">
        <div className='sm:mt-7 mt-8 flex flex-col justify-center items-center gap-2'>
          <img className='w-5 h-5' src="/plus.png" alt="" />
          <p className='sm:text-[13px] text-[10px] sm:font-[700] font-[400] '>Add</p>
        </div>
        </a>
        <a href="/profile">
        <div className='sm:mt-7 mt-8 mb-7 flex flex-col justify-center items-center gap-2'>
          <div className='w-10 h-10 bg-black rounded-full overflow-hidden'>
          <img className='w-full h-full object-cover' src={image || '/man-avatar.png'} alt="" />
          </div>
          <p className='sm:text-[13px] text-[10px] sm:font-[700] font-[400] '>profile</p>
        </div>
        </a>
      </div>
      
    </div>
  )
}

export default Menubar
