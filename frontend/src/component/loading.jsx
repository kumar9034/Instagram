import React from 'react'

const loading = () => {
  return (
    <div className='flex flex-col justify-between items-center h-screen'>
      <img className='w-40 h-40 mt-50' src="/logo.png" alt="" />

       <div className="flex items-center justify-center h-screen">
  <svg className="animate-spin h-16 w-16" viewBox="0 0 50 50">
    <defs>
      <linearGradient id="insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#feda75"/>
        <stop offset="25%" stop-color="#fa7e1e"/>
        <stop offset="50%" stop-color="#d62976"/>
        <stop offset="75%" stop-color="#962fbf"/>
        <stop offset="100%" stop-color="#4f5bd5"/>
      </linearGradient>
    </defs>
    <circle
      className="opacity-25"
      cx="25"
      cy="25"
      r="20"
      stroke="url(#insta-gradient)"
      stroke-width="5"
      fill="none"
    />
    <path
      fill="url(#insta-gradient)"
      d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 0 0-15-15z"
    />
  </svg>
</div>

    </div>
  )
}

export default loading
