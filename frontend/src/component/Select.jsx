import React, { useRef, useState } from 'react'

const Select = ({ musicUrl, lyrics }) => {
  const audioRef = useRef(null)
  const [activeLine, setActiveLine] = useState(null)

  // Play from a specific lyric
  const playFrom = (time, line) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      audioRef.current.play()
      setActiveLine(line)
    }
  }

  return (
    <div className="flex flex-col items-center p-5 bg-gray-50 min-h-screen">
      {/* Music Player */}
      <audio ref={audioRef} src={musicUrl} controls className="mb-3 w-full"></audio>

      {/* Lyrics Box */}
      <div className="w-80 h-60 overflow-y-auto border rounded-lg p-3 bg-white shadow">
        {lyrics.map((item, i) => (
          <p
            key={i}
            className={`cursor-pointer p-2 rounded transition ${
              activeLine === i
                ? "bg-purple-500 text-white"
                : "hover:bg-purple-100"
            }`}
            onClick={() => playFrom(item.time, i)}
          >
            {item.line}
          </p>
        ))}
      </div>

      {/* Add to Story Button */}
      <button
        onClick={() => alert(`Story ban gai with lyric: "${lyrics[activeLine]?.line}"`)}
        className="mt-5 px-6 py-2 bg-red-500 text-white rounded-xl shadow-lg"
      >
        Add to Story
      </button>
    </div>
  )
}

export default Select
