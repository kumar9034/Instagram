import React, { useEffect, useRef } from 'react'
import Menubar from './Menubar'
import Logout from './Logout'
import { useState } from 'react'
import Profileimage from './Profileimage'
import { useContext } from 'react'
import { UserContext } from './Contextapi'
import axios from 'axios'

const UserProfile = () => {
    const { id } = useContext(UserContext)
    const [data, setdata] = useState()
    const details = data?.user?.profile
    const username = data?.user?.username
    const followers = data?.user?.followers.length
    const following = data?.user?.following.length
    const [Allpost, setAllposts] = useState([])
    const Inputref = useRef(null)
    const [showPopup, setShowPopup] = useState(false)
    const [image, setimage] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false);

    const imageadd = () => {
        Inputref.current.click();
    }

    const fatchdata = async () => {
        const API = import.meta.env.VITE_API_URL
        const token = localStorage.getItem('token')
        const res = await axios({
            url: `${API}/user/${id}/userprofile`,
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        console.log(res)
        setdata(res.data)
        setAllposts(res.data.posts)
    }

    useEffect(() => {
        fatchdata()
    }, [])

    const handlebutton = async () => {
        const API = import.meta.env.VITE_API_URL
        const token = localStorage.getItem("token")
        const res = await axios({
            url: `${API}/user/${id}/follower`,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        console.log(res)
        if (res.status === 200) {
            setIsFollowing(!isFollowing);
        }
    }

    return (
        <div className='flex w-full h-auto '>
            <div className="fixed">
                <Menubar />
            </div>
            <Logout show={showPopup} onClose={() => setShowPopup(false)}>
            </Logout>

            <Profileimage images={image} off={() => setimage(false)}>
            </Profileimage>
            <div className=' w-full ml-30 h-full flex flex-col overflow-y-auto no-scrollbar items-center'>
                <div className='flex h-70 '>
                    <div className='mt-18 ml-35'>
                        <div className='w-[12vw] h-[25vh]   rounded-full  border-gray-300 flex justify-center  overflow-hidden'>
                            <img className='w-full h-full object-cover' src={details?.image || "/man-avatar.png"} alt="" />
                        </div>

                    </div>
                    <div className='ml-20 w-[40vw] h-50 mt-10  p-5'>
                        <div className='flex gap-4'>
                            <h1 className='text-xl font-[400] '>{username}</h1>
                        </div>
                        <div className='mt-4 flex gap-7'>
                            <p className='text-lg font-[500] flex gap-1 '>{Allpost.length}<span className='text-lg text-[#737373] font-[400]'>posts</span></p>
                            <p className='text-lg font-[500] flex gap-1 '>{followers}<span className='text-md text-[#737373] font-[400]'>followers</span></p>
                            <p className='text-lg font-[500] flex gap-1 '>{following}<span className='text-md text-[#737373] font-[400]'>following</span></p>
                        </div>
                        <div className='mt-4 gap-5 flex'>
                            <button
                                onClick={handlebutton}
                                className={`px-15 py-2 text-sm rounded-lg font-semibold cursor-pointer transform duration-300 transition 
                                ${isFollowing ? 'bg-gray-300 text-black hover:scale-95 hover:shadow-lg' : 'bg-blue-500 text-white hover:scale-95 hover:shadow-lg'}`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>

                            <button className='px-15 py-2 bg-gray-200 text-black text-sm rounded-lg font-semibold cursor-pointer'>
                                Message
                            </button>
                        </div>
                        <div className='w-50 mt-5 text-[14px] font-[600]'>
                            <p>{details?.bio}</p>
                        </div>
                    </div>
                </div>
                <div className='w-full h-40 flex  gap-10 mt-5 px-30 py-5 overflow-hidden overflow-scroll no-scrollbar'>
                    <input hidden ref={Inputref} type="file" />
                    <div
                        onClick={imageadd}
                        className='w-20 h-20 rounded-full bg-[#dbdbdb] flex justify-center items-center cursor-pointer'>
                        <div className='w-18 h-18 rounded-full bg-white overflow-hidden flex justify-center items-center'>
                            <img className='w-16 h-16  object-container' src="/plus (1).png" alt="" />
                        </div>
                    </div>
                    <div
                        hidden
                        className='w-24 h-24 rounded-full bg-[#dbdbdb] flex justify-center items-center'>
                        <div className='w-22 h-22 rounded-full bg-white overflow-hidden flex justify-center items-center'>
                            <img className='w-18 h-18  object-container' src="plus (1).png" alt="" />
                        </div>
                    </div>
                </div>
                <div className='w-[79vw]  flex flex-col   ml-15  h-auto'>
                    <div className='flex w-full h-10 px-20 py-10  justify-between '>
                        <div>
                            <img className='w-10 h-10' src="/total.png" alt="" />
                        </div>
                        <div>
                            <img className='w-8 h-8' src="/video.png" alt="" />
                        </div>
                        <div>
                            <img className='w-8 h-8' src="/bookmark.png" alt="" />
                        </div>
                    </div>
                    <div className='w-full h-full  p-2 flex flex-wrap gap-1'>
                        {Allpost.map((items) => <div key={items.id}>
                            <img className='w-[25vw] h-[65vh] object-cover rounded' src={items.image} alt="" />
                        </div>
                        )}

                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserProfile
