import React, { useEffect, useState } from 'react'
import Loading from './component/loading'
import Register from './component/register'
import {Routes, Route } from "react-router-dom"
import Login from './component/Login'
import Verification from './component/verifcation'
import Dashboard from './component/Dashboard'
import Profile from './component/Profile'
import Music from './component/Music'
import Stroy from './component/Stroy'
import Select from './component/Select'
import Posts from './component/Posts'
import UserProfile from './component/UserProfile'
import Chatmessage from './component/Chatmessage'
const App = () => {
const [loading , setLoading] = useState(true)

useEffect(()=>{
 setTimeout(() => {
  setLoading(false)
 }, 2000);
},[])
if (loading) {
  return <Loading />;
}

  return (
    <div>
      {/* <Verification/>
      <Select/> */}
     
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verification" element={<Verification/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/music" element={<Music/>}/>
        <Route path="/story" element={<Stroy/>}/>
        <Route path="/posts" element={<Posts/>}/>
        <Route path="/:id/userprofile" element={<UserProfile/>}/>
        <Route path="/message" element={<Chatmessage/>}/>
      </Routes >
    </div>
  )
}

export default App
 