import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6"

export default function Posts() {
  const [caption, setCaption] = useState("");
  const [cover, setFile] = useState(null);
  const [image , setimage] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  
  const formdata = new FormData()
  formdata.append("cover", cover)
  
    const handlebutton = async()=>{
      const API =import.meta.env.VITE_API_URL
      const res = await axios.post(`${API}/post/image`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setimage(res.data.path)
      console.log(res)
    }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!image) {
    //   alert("Please select an image");
    //   return;
    // }

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // JWT token from login
      const API = import.meta.env.VITE_API_URL
      const res = await axios.post(`${API}/post/create`, { caption, image }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
 
      if(res.status === 200){
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Error uploading post:", err.response?.data || err.message);
      alert("Error uploading post");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full h-screen sm:px-20 px-5 py-6">
    <div className="upload-box h-[90vh] sm:px-20 px-5 py-10 border-1  border-gray-300 shadow-lg rounded " style={{ maxWidth: "100%", }}>
      <form className="w-full  " onSubmit={handleSubmit}>
        <a href="/dashboard">
        <div className="text-sm font-[600] flex gap-3 "><FaArrowLeftLong  size={18}className="mt-1" />Back </div>
        </a>
        <div className=" w-full flex gap-4 mt-2 " style={{ marginBottom: "10px" }}>
          <label>Image:</label>
          <input className="boder-1 border-gray-300 w-[50%] h-[5vh] cursor-pointer" type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
          <button
          onClick={handlebutton}
          className="px-4 py-2 bg-orange-500 text-sm text-white font-[500] sm:ml-40 cursor-pointer rounded-lg hover:shadow-lg hover:scale-95 transform duration-300 ">photo upload</button>
        </div>
        <div className="sm:w-[20vw] w-[7rem] sm:h-[20vw] h-[7rem]  rounded-lg">
              <img className="w-auto h-auto object-container rounded-lg" src={image || "man-avatar.png"} alt="" />
        </div>

        <div className="w-full sm:h-[10vh] h-[12rem] flex gap-4 mt-5 pr-5" style={{ marginBottom: "10px" }}>
          <label className="mt-4 text-md font-[500]">Caption:</label>
          <textarea
          className="w-full h-full outline-none border-1 border-gray-300 rounded-lg p-2 text-sm"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            required
          />
        </div>

        <button className="bg-green-500 px-4 py-2 text-white text-md font-[600] rounded-lg mt-1 cursor-pointer hover:scale-95 hover:shadow-lg transation-scale transform duration-300" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </form>
    </div>
    </div>
  );
}
