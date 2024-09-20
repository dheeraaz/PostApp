import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { MdOutlineLogout } from "react-icons/md";
import { useGlobalAppContext } from '../Context/AppContext';

import { logOut } from '../Apis/appApi.js';
import { toast } from 'react-toastify';

const AppHeader = () => {
  const {setIsLoggedIn,userDetails, setUserDetails} = useGlobalAppContext();
  const navigate = useNavigate();
  
  const handleLogOut = async ()=>{
    try {
      const response = await logOut();

      if(response?.status === 200){
        setUserDetails({});
        toast.success(response?.data?.message);
        setIsLoggedIn(false);
        navigate('/')
      }
    } catch (error) {
      console.error("Error while logging out user==>", error)
    }
  }

  return (
    <nav className='max-w-[1536px] w-full mx-auto p-4 bg-_primary flex justify-between items-center'>
      <div className='max-w-[110px] h-full'>
        <Link to='/home'>
          <img src="/images/LogoPostApp.png" alt="logo_postApp" className='w-full h-full' />
        </Link>
      </div>
      <div className='flex items-center gap-4'>
        <NavLink
          to='/home/profile'
          className={({isActive}) => { return `inline-block max-w-10 max-h-10 rounded-full p-[2px] ${isActive ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-transparent"}` }}
          end
        >
          <img src={userDetails.profilepic} alt="prfile_img" className='w-full h-full rounded-full bg-gray-700' />
        </NavLink>
        <button onClick={handleLogOut}>
          <MdOutlineLogout size={25} className='hover:text-purple-600' />
        </button>
      </div>
    </nav>
  )
}

export default AppHeader