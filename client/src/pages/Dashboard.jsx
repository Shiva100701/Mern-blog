import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPosts from '../components/DashPosts'



function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
    // console.log(location);
  },[location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row '>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {tab==='profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
    </div>
  ) 
}

export default Dashboard