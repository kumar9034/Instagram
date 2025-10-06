import axios from 'axios';
import React, { useState } from 'react';

const Profileimage = ({ images, off }) => {
  const [image, setImage] = useState(null); // ✅ file object
  const [bio, setBio] = useState("");

  if (!images) return null;

  const handlebutton = async () => {
    try {
      const token = localStorage.getItem("token");
      const API = import.meta.env.VITE_API_URL;

      const formData = new FormData();
      formData.append("cover", image);  // ✅ file append correctly
      formData.append("bio", bio);

      console.log("Token:", token);
      console.log("FormData:", [...formData.entries()]);

      const res = await axios.put(`${API}/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,   // ✅ Bearer token
        },
      });

      console.log("Upload Success:", res.data);
      if(res.status === 200){
        off()
      }
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={off}
    >
      <div
        className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg p-6 w-10/12 h-70 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="mb-2 flex gap-30">
            <p className="mt-2 text-md font-[500]">Select image</p>
            <div className="w-50 h-10 border-1 border-gray-300 rounded p-2">
              <input
                onChange={(e) => setImage(e.target.files[0])}  // ✅ file object store
                className="w-full h-full"
                type="file"
                accept="image/*"
              />
            </div>
          </div>

          <div className="w-full h-35 border-1 border-gray-400 rounded">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full h-full p-2 outline-none"
              placeholder="Write a bio..."
            />
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <button
            onClick={off}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={handlebutton}
            className="px-5 py-2 bg-green-500 rounded-lg text-white text-sm font-[600] cursor-pointer hover:scale-95 transform transition duration-300"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profileimage;
