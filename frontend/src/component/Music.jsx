import axios from "axios"
import React, { useEffect, useState, useRef } from "react"

const Music = () => {
  const [data, setData] = useState([])
  const [currentPlaying, setCurrentPlaying] = useState(null) // konsa song chal raha hai
  const audioRef = useRef(null)

  useEffect(() => {
    const music = async () => {
      try {
        const API = import.meta.env.VITE_API_URL
        const res = await axios.get(`${API}/music/all`)
        setData(res.data)
      } catch (err) {
        console.error("Error fetching music:", err)
      }
    }
    music()
  }, [])

  // Play / Pause handler
  const togglePlay = (url, id) => {
    if (currentPlaying === id) {
      // Agar wahi song already play ho raha hai
      audioRef.current.pause()
      setCurrentPlaying(null)
    } else {
      audioRef.current.src = url
      audioRef.current.play()
      setCurrentPlaying(id)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col gap-5 p-5">
      {/* Search box */}
      <div className="flex justify-center ">
      <div className="w-80 h-10 border-2 border-gray-300 bg-gray-100 rounded-xl mt-5 flex items-center px-3">
        <img className="w-5 h-5 object-contain mr-2" src="search.png" alt="search" />
        <input
          className="w-full h-full outline-none bg-transparent"
          type="text"
          placeholder="Search songs..."
        />
      </div>
        <button className="px-4 py-1 w-30 h-10 mt-5 rounded-xl bg-red-400 text-white ml-2">Search</button>
      </div>

      {/* Music List */}
      <div className="w-full h-full bg-gray-50 p-5 overflow-y-auto">
        {data.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-5 w-full p-3 mb-3 bg-white shadow-md rounded-xl"
          >
            {/* Cover image */}
            <div className="w-20 h-20 rounded overflow-hidden bg-gray-200">
              {item.coverUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={'https://images.genius.com/d7a02693d69d1c65e4b47de07989900a.300x300x1.jpg'}
                  alt={item.title}
                />
              ) : (
                <p className="text-xs text-center mt-7">No Cover</p>
              )}
            </div>

            {/* Song info */}
            <div className="flex flex-col flex-1">
              <h1 className="text-lg font-semibold">{item.title}</h1>
              <p className="text-sm text-gray-600">{item.artist}</p>
            </div>

            {/* Play / Pause Button */}
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white"
              onClick={() => togglePlay(item.musicUrl, item._id)}
            >
              {currentPlaying === item._id ? "Pause" : "Play"}
            </button>
          </div>
        ))}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setCurrentPlaying(null)} />
    </div>
  )
}

export default Music
