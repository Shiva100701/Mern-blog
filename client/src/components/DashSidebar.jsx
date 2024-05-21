import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import axios from "axios";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    // console.log(location);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout");
      console.log(res);
      if (res.status == 200) {
        dispatch(signoutSuccess());
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as= 'div'
            >
              Profile
            </Sidebar.Item>
          </Link>
            <Sidebar.Item  icon={HiArrowSmRight} className="cursor-pointer mt-1" onClick = {handleSignout}>
              Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
