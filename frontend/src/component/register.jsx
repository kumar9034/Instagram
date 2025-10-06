import React, { useContext, useState } from 'react'
import axios from "axios"
import { UserContext } from './Contextapi'
import { useNavigate } from 'react-router-dom'
import { Popup } from './Popup'
import { useEffect } from 'react'



const register = () => {

  const [fullname, setfullname] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword ] = useState("")
  const [username, setusername] = useState("")
   const { setData } = useContext(UserContext)
   const navigate = useNavigate()
   const [error, seterror] = useState()

   useEffect(()=>{
     setData(handlebutton)

   },[])
  const handlebutton = async (e)=>{

    // e.preventDefault()
    setemail("")
    setfullname("")
    setpassword("")
    setusername("")
    // console.log({fullname, email, password, username})

    if (!fullname || !username || !email || !password) {
      seterror("Something went wrong!");
      setTimeout(()=>{
       seterror("")
       }, 2000) // API call stop karne ke liye
 } else{
   try {
     const API = import.meta.env.VITE_API_URL
     const res = await axios({
       url: `${API}/user/send-otp`,
       method: "Post",
       data: {"email": email}
     })

     console.log(res)
     if(res.status === 200){
       navigate("/verification")
       localStorage.setItem("email", email)

     }
     
   } catch (error) {
     seterror('API not work !')
   }
 
 }
   

    
    setData({
      fullname,
      email,
      username,
      password,
    })

  }
  return (
    <div className='w-full h-auto flex justify-center items-center flex-col'>
      <Popup message={error} />
      <div className='w-100 h-[100vh] mt-3 border-1 border-gray-300 shadow-md flex flex-col '>
        <div className='w-90 h-[35vh] ml-20  '>
          <img className=' mt-10 ml-15 w-30 h-[18vh]' src="register-logo1.webp" alt="" />
          <p className='w-[20vw] h-[20vh] lg-ml-7 text-center font-[700] text-[1.2vw] text-[#737373]'>Sign up to see photos and videos from your friends.</p>
        </div>
        <div className='ml-20 gap-2 flex flex-col'>
          <div className='w-60 h-10 border-1 border-gray-300  rounded '>
            <input
            value={email}
            onChange={(e)=>setemail(e.target.value)}
            className='w-full h-full py-2 px-3 text-sm outline-none ' type="email" placeholder=' Phone number or email' />
          </div>
          <div className='w-60 h-10 border-1 border-gray-300  rounded '>
            <input
            value={password}
            onChange={(e)=>{setpassword(e.target.value)}}
            className='w-full h-full py-2 px-3 text-sm outline-none ' type="password" placeholder=' Password ' />
          </div>
          <div className='w-60 h-10 border-1 border-gray-300  rounded '>
            <input
            value={fullname}
            onChange={(e)=>{setfullname(e.target.value)}}
             className='w-full h-full py-2 px-3 text-sm outline-none ' type="text" placeholder=' Full Name' />
          </div>
          <div className='w-60 h-10 border-1 border-gray-300  rounded '>
            <input
            value={username}
            onChange={(e)=>{setusername(e.target.value)}}
            className='w-full h-full py-2 px-3 text-sm outline-none ' type="text" placeholder=' Username' />
          </div>
        </div>
        <div className='pl-10 pr-5 pt-8  text-center text-[1vw] font-[500] text-[#737373]'>
          People who use our service may have uploaded your contact information to Instagram. <span className='text-blue-500 font-[500] text-[1vw]'>Learn More</span>
        </div>
        <div className='pl-10 pr-5 pt-4  text-center text-[1vw] font-[400] text-[#737373]'>
          By signing up, you agree to our  <span className='text-blue-500 font-[400] text-[1vw]'>Terms , Privacy Policy and Cookies Policy .</span>
        </div>
        <div className='mt-5 ml-20'>
          <button
          onClick={handlebutton}
          className='px-25 py-2  font-semibold text-white rounded bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-lg hover:scale-95 transform transition duration-300 cursor-pointer'>
            Sign up
          </button>
        </div>
      </div>
      <div className='w-[30vw] h-[13vh] border-1 shadow-md rounded border-gray-300 mt-10 mb-10 flex flex-col justify-center items-center  '>
        <p className='text-sm font-[400]'>Have an account?</p>
        <a href="/">
        <span className='text-md font-[500] text-blue-500 '>Log in</span>
        </a>
      </div>

    </div>
  )
}

export default register
