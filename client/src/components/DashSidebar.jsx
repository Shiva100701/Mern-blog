import { Sidebar } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';

function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      // console.log(tabFromUrl);
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
      // console.log(location);
    }, [location.search]);
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to={'/dashboard?tab=profile'}>
                <Sidebar.Item active= {tab==='profile'}  icon={HiUser}label= {'User'} labelCOlor = 'dark'>Profile</Sidebar.Item>
                <Sidebar.Item  icon={HiArrowSmRight} className="cursor-pointer mt-1" >Sign Out</Sidebar.Item>
                </Link>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar