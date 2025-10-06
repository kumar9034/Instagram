import React from 'react'
import { UserContext } from './Contextapi'
import { useState } from 'react'
import { Popup } from './Popup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
const [email, setemail] = useState("")
const [password, setpassword] = useState("")
let navigate = useNavigate()

const handlebutton = async (e)=>{
    e.preventDefault()

    try {
        const API = import.meta.env.VITE_API_URL
        const res = await axios({
            url: `${API}/user/login`,
            method : "post",
            data : {identifier: email, password: password}
        })

        console.log(res)
        if(res.status === 200){
            navigate("/dashboard")
            const token = res.data.token
            localStorage.setItem("token", token)
            
        }
        
    } catch (error) {
       console.log("api not respones !", error) 
    }

    
}



  return (
    <div className='w-full h-screen  '>
            <div className='w-full h-[98%]  flex justify-center gap-5 items-center'>
                <div className='h-[40vh] w-[40vw] flex justify-center items-center '>
                    <img src="landing-pageimage.png" alt="" />
                </div>
                <div className='w-[40vw] h-full  flex flex-col items-center  '>
                    <div className='w-30 h-30 mt-20'>
                        <img src="register-logo1.webp" alt="" />
                    </div>
                    <div className='flex flex-col gap-3 mt-5 '>
                        <div className='w-80 h-10 border-1 border-gray-300 rounded  '>
                            <input
                            value={email}
                            onChange={(e)=>{
                                setemail(e.target.value)
                            }}
                            className='w-full h-full text-sm outline-none py-2 px-3' type="text" placeholder='username, email ' />
                        </div>
                        <div className='w-80 h-10 border-1 border-gray-300 rounded   '>
                            <input
                            value={password}
                            onChange={(e)=>{
                                setpassword(e.target.value)
                            }}

                            className='w-full h-full text-sm outline-none py-2 px-3' type="password" placeholder='Password' />
                        </div>
                        <div className=' mt-5 ml-15'>
                            <button
                            onClick={handlebutton}
                            className='px-20 py-2  font-semibold text-white rounded bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] shadow-lg hover:scale-95 transform transition duration-300 cursor-pointer'>
                                Login
                            </button>
                        </div>
                    </div>
                    

                    <div className='mt-8 text-center'>
                        <a href="/">
                        <h1 className='text-sm font-[600]  '>
                            Forgot password?
                        </h1>
                        </a>
                        <span className='flex mt-5'>
                            <p className='text-sm font-[400]'>Don't have an account?</p>
                        <a href="/register">
                            <h1 className='text-sm text-blue-500 font-[600] ml-1'>
                                Sign up
                            </h1>
                        </a>
                        </span>
                    </div>

                </div>

            </div>

        </div>
  )
}

export default Login
