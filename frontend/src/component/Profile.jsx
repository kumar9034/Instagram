import React, { useEffect, useRef } from 'react'
import Menubar from './Menubar'
import Logout from './Logout'
import { useState } from 'react'
import Profileimage from './Profileimage'
import { useContext } from 'react'
import { UserContext } from './Contextapi'
import axios from 'axios'

const Profile = () => {
  const Inputref = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const [image, setimage] = useState(false)
  const { detail } = useContext(UserContext)

  const details = detail?.user?.profile
  const username = detail?.user?.username
  const followers = detail?.user?.followers.length
  const following = detail?.user?.following.length
  const [Allpost, setAllposts] = useState([])
  const imageadd = () => {
    Inputref.current.click();
  }

  useEffect(() => {
    const allposts = async () => {
      const token = localStorage.getItem("token")
      const API = import.meta.env.VITE_API_URL
      const res = await axios({
        url: `${API}/post/posts`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      setAllposts(res.data.posts)
      console.log(res)
    }

    allposts()
  }, [])

  return (
    <div className='sm:flex w-full h-auto '>
      <div className="fixed">
        <Menubar />
      </div>
      <Logout show={showPopup} onClose={() => setShowPopup(false)}>
      </Logout>

      <Profileimage images={image} off={() => setimage(false)}>
      </Profileimage>
      <div className=' w-full sm:ml-30  pl-22 h-full flex flex-col overflow-y-auto no-scrollbar'>
        <div className='sm:flex h-70 '>
          <div className='sm:mt-18 mt-10 sm:ml-35 ml-5  '>
            <div className='sm:w-[12vw] w-[15vh] sm:h-[25vh] h-[15vh]   rounded-full  border-gray-300 flex justify-center  overflow-hidden'>
              <img className='w-full h-full object-cover' src={details?.image || "man-avatar.png"} alt="" />
            </div>
          </div>
          <div className='sm:ml-20  w-[40vw] h-50 sm:mt-10 mt-5  sm:p-5 px-3'>
            <div className='flex gap-4'>
              <h1 className='sm:text-xl text-lg font-[600]  -mt-5 '>{username}</h1>
              <div className='flex gap-3 mt-5' >
              <button
                onClick={() => setimage(true)}
                className='sm:px-4 px-2 py-2 bg-[#f0f2f5] -mt-12 sm:text-sm text-[10px] font-[500] rounded-lg cursor-pointer '>
                Edit profile
              </button>
              <img
                onClick={() => setShowPopup(true)}
                className='sm:w-8 w-5 sm:h-8 h-5 -mt-9 cursor-pointer ' src="setting.png" alt="" />

              </div>
            </div>
            <div className='mt-4 flex gap-7'>
              <p className='sm:text-lg text-sm font-[500] flex gap-1 '>{Allpost.length}<span className=' text-[#737373] font-[400]'>posts</span></p>
              <p className='sm:text-lg text-sm font-[500] flex gap-1 '>{followers}<span className=' text-[#737373] font-[400]'>followers</span></p>
              <p className='sm:text-lg text-sm font-[500] flex gap-1 '>{following}<span className=' text-[#737373] font-[400]'>following</span></p>
            </div>
            <div className='w-50 mt-5 sm:text-[14px] text-[12px] font-[600]'>
              <p>{details?.bio}</p>
            </div>
          </div>
        </div>
        <div className='w-full sm:h-40 h-15 flex  gap-10 sm:mt-5 mt-15 sm:px-30 pl-5 sm:py-5 overflow-hidden overflow-scroll no-scrollbar'>
          <input hidden ref={Inputref} type="file" />
          <div
            onClick={imageadd}
            className='sm:w-20 w-15 sm:h-20 h-15 rounded-full bg-[#dbdbdb] flex justify-center items-center cursor-pointer'>
            <div className='sm:w-18 w-13 sm:h-18 h-13 rounded-full bg-white overflow-hidden flex justify-center items-center'>
              <img className='sm:w-16 w-11 sm:h-16 h-11  object-container' src="plus (1).png" alt="" />
            </div>
          </div>
          <div
            hidden
            className='sm:w-24 w-10  sm:h-24 h-10 rounded-full bg-[#dbdbdb] flex justify-center items-center'>
            <div className='sm:w-22 w-8 sm:h-22 h-8 rounded-full bg-white overflow-hidden flex justify-center items-center'>
              <img className='sm:w-18 w-4 h-18 h-4  object-container' src="plus (1).png" alt="" />
            </div>
          </div>
        </div>
        <div className='sm:w-[79vw] w-full  flex flex-col   sm:ml-15  h-auto'>
          <div className='flex w-full h-10 sm:px-20 px-10  py-10 justify-between '>
            <div>
              <img className='sm:w-10 w-6 sm:h-10 h-6' src="total.png" alt="" />
            </div>
            <div>
              <img className=' sm:w-8 w-4 sm:h-8 h-4' src="video.png" alt="" />
            </div>
            <div>
              <img className='sm:w-8 w-4 sm:h-8 h-4' src="bookmark.png" alt="" />
            </div>
          </div>
          <div className='w-full h-full  p-2 flex flex-wrap gap-1'>
            {Allpost.map((items) => <div key={items._id} className='sm:w-[25vw] w-[40%] h-auto sm:h-[65vh]'>
              <img className='sm:w-[25vw] w-[100%] h-auto sm:h-[65vh] object-cover rounded' src={items.image} alt="" />
            </div>
            )}

          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile
