import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ show, onClose}) => {
    const navigate = useNavigate()
  if (!show) return null;
  const handlebutton =async ()=>{
    const token = localStorage.getItem("token")
    const API = import.meta.env.VITE_API_URL
    const res = await axios({
        url: `${API}/user/logout`,
        method: "Post",
         headers: {
          Authorization: `Bearer ${token}`,  // ✅ header me token bhejna zaruri
          "Content-Type": "application/json"
        },
    })
    console.log(res)
    if(res.status === 200){
        localStorage.removeItem("token")
        navigate("/")
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-gray bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg p-6 w-11/12 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
        <div className="mb-4">
            User Logout 
        </div>
        <button
        onClick={handlebutton}
        className="px-5 py-2 bg-green-500 rounded-lg text-white text-sm font-[600] cursor-pointer  hover:scale-95 transform transition duration-300">
                Logout
        </button>

        </div>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Logout;
