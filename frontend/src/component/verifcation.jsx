import axios from 'axios'
import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { UserContext } from './Contextapi'
import { useNavigate } from 'react-router-dom'
import { Popup } from './Popup'

const verifcation = () => {
  const [email, setemail] = useState("")
  const [otp, setotp ] = useState("")
  const { register } = useContext(UserContext)
  const [error , seterror] = useState("")
  const navigate = useNavigate()

  useEffect(()=>{
    const storeemail = localStorage.getItem("email")
    setemail(storeemail)
  },[])

  const handlebutton =async (e)=>{
    e.preventDefault()

    const API = import.meta.env.VITE_API_URL
try{
  const res = await axios({
    url: `${API}/user/verify-otp`,
    method: "POST",
    data : {"email": email, "otp": otp}
  })

  console.log(res)

  if(res.status === 200 ){
    register()
    seterror("Sign up successfully !")
    setTimeout(() => {
      seterror("")
    },4000);
    setTimeout(() => {
      navigate("/")
      localStorage.removeItem(email)
    }, 5000);
    
  }
} catch (error) {
  console.error(error);
}
}


  return (
    <div className='w-full h-screen flex sm:justify-center items-center '>
      <Popup  message={error}/>
      <div className='sm:w-100 w-full h-full sm:h-[70%] border-1 border-gray-300 shadow-lg text-center '>
        <img className='sm:w-[7vw] w-[4rem] h-[20vh] sm:ml-37 ml-30 sm:mt-5 mt-20' src="phone1.png" alt="" />
        <p className='text-md font-[500] -ml-6 -mt-5'>just one more step</p>
        <p className='flex flex-col text-center -ml-6 text-sm mt-10'>
          Enter the 6 Digit code we send : <span className='text-sm font-[500] '>
            {email}
          </span>
        </p>
        <div className='w-70 ml-8 h-10 border-1 border-gray-300 mt-4 sm:ml-15 rounded bg-gray-100  hover:shadow-xl hover:scale-104 transfrom transition duration-300 '>
          <input
          value={otp}
          onChange={(e)=>{setotp(e.target.value)}}
          className=' py-2 px-4 w-full h-full outline-none ' type="text" placeholder='#######' />
        </div>
        <div className='mt-5'>
          <button
          onClick={handlebutton}
          className='px-10 py-2  font-semibold text-white rounded-xl bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-lg hover:scale-95 transform transition duration-300 cursor-pointer'>
            confirm
          </button>
        </div>
        <div className='w-full justify-center gap-4 items-center mt-5 h-3 flex'>
          <p className='text-sm font-[600] text-blue-500 cursor-pointer '>Request New code </p>
           <span>||</span>
           <a href="/">
          <p className='text-sm font-[600] text-blue-500 cursor-pointer '>Log in </p>
           </a>
        </div>
      </div>
    </div>
  )
}

export default verifcation
