import React from 'react'
import Story from './story'
import Video from './Video'
import Menubar from './Menubar'
const Dashboard = () => {
  const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // true if token exists
};

isLoggedIn()
  return (
    <div className='w-full h-screen overflow-y-hidden  overflow-y-scroll no-scrollbar flex flex-col '>
      <div className='fixed'>
      <Menubar/>
      </div>
      <Video/>
    </div>
  )
}

export default Dashboard
