import axios from "axios";
import React, { createContext, useState } from "react";
import { useEffect } from "react";

// 1. Context banao
export const UserContext = createContext();

// 2. Provider banao
export const UserProvider = ({ children }) => {
  const [data, setData] = useState(null);
 const [res , setres] = useState("")
 const [detail , setdetail] = useState("")
 const [id , setId] =useState('')
  
const register =  async()=>{

    try{
        const API = import.meta.env.VITE_API_URL
        const res = await axios({
            url: `${API}/user/`,
            method: "POST",
            data: data
        })
        
        
    }catch(err){
        console.log("api error!", err)
    }
}

useEffect( ()=>{
  const detail =async()=>{
    const token = localStorage.getItem("token")
    const API = import.meta.env.VITE_API_URL 
    const res = await  axios.get(`${API}/user/profiledetail`, 
    { headers: { Authorization: `Bearer ${token}` } })
  
    setdetail(res.data)
    console.log(res
    )
  }
  detail()
},[])


  return (
    <UserContext.Provider value={{  setData, register , res, setres, detail , id, setId }}>
      {children}
    </UserContext.Provider>
  );
};
