import React, { useRef, useState } from 'react'

const story = () => {
  const imageRef = useRef(null)
  const [image , setimage] = useState(null)

  console.log(image)
  const addimage = ()=>{
      imageRef.current.click()
  }


  return (
    <div className='sm:w-[50vw] w-auto h-[23vh] ml-10 mr-5   flex gap-7 items-center px-10 overflow-x-hidden  overflow-x-scroll no-scrollbar '>
      <input hidden
      value={image}
      onChange={(e)=>{setimage(e.target.value)}}
      type="file" ref={imageRef} />
      <div
      onClick={addimage}
      className='flex flex-col gap-1 mt-2 '>
        <div className="sm:w-18 w-10 h-10 sm:h-18 rounded-full  p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:shadow-xl hover:scale-109 transform transition duration-300 cursor-pointer">
          {/* Inner white background with image */}
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <img
              src="profile.png"  // yahan apni profile image link do
              alt="profile"
              className="w-full h-full rounded-full object-container "
            />
          </div>
        </div>
        <p className='sm:text-sm text-[12px] font-[400] '>username</p>
      </div>
      <div className='flex flex-col gap-1 mt-2 '>
        <div className="sm:w-18 w-10 h-10 sm:h-18 w-10 h-10 rounded-full  p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:shadow-xl hover:scale-109 transform transition duration-300 cursor-pointer">
          {/* Inner white background with image */}
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <img
              src="profile.png"  // yahan apni profile image link do
              alt="profile"
              className="w-full h-full rounded-full object-container "
            />
          </div>
        </div>
        <p className='sm:text-sm text-[12px] font-[400] '>username</p>
      </div>
      <div className='flex flex-col gap-1 mt-2 '>
        <div className="sm:w-18 w-10 h-10 sm:h-18 w-10 h-10 rounded-full  p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:shadow-xl hover:scale-109 transform transition duration-300 cursor-pointer">
          {/* Inner white background with image */}
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <img
              src="profile.png"  // yahan apni profile image link do
              alt="profile"
              className="w-full h-full rounded-full object-container "
            />
          </div>
        </div>
        <p className='sm:text-sm text-[12px] font-[400] '>username</p>
      </div>
      <div className='flex flex-col gap-1 mt-2 '>
        <div className="sm:w-18 w-10 h-10 sm:h-18 w-10 h-10 rounded-full  p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 hover:shadow-xl hover:scale-109 transform transition duration-300 cursor-pointer">
          {/* Inner white background with image */}
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <img
              src="profile.png"  // yahan apni profile image link do
              alt="profile"
              className="w-full h-full rounded-full object-container "
            />
          </div>
        </div>
        <p className='sm:text-sm text-[12px] font-[400] '>username</p>
      </div>
      
      
    </div>
  )
}

export default story
