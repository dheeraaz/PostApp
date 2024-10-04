import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import ProfileCard from '../../Components/ProfileCard.jsx';

import { getUserInfo, getUserPosts } from '../../Apis/appApi.js';
import PostCard from '../../Components/Post-Card/PostCard.jsx';
import { useParams } from 'react-router-dom';

const ProfileUser = () => {
  const { userDetails } = useGlobalAppContext();
  const { userId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({});


  const getUserPostsFunction = async () => {
    try {
      const response = await getUserPosts(userId);
      if (response?.status === 200) {
        setUserPosts(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
    }
  }

  const getUserInfoFunction = async (id) => {
    try {
      const response = await getUserInfo(id);
      if(response?.status===200){
        setUserInfo(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getUserPostsFunction(), getUserInfoFunction(userId)])
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if(userId){
      fetchData();
    }

  }, [userId])

  useEffect(() => {
    if (isModalOpen || isProfileModalOpen || isCoverModalOpen) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = 'auto'; // Enable scroll
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, isProfileModalOpen, isCoverModalOpen]);


  return (
    <>
      <ProfileCard postCount={userPosts.length} profileId={userId} userInfo={userInfo} />

      {/* posts */}
      {userPosts?.length > 0 ? (userPosts.map((post, index) => {
        return <PostCard key={index} post={post} />
      })) : (
        <div className='text-center'>
          <p className='text-gray-500'>No Posts Available</p>
        </div>
      )}
    </>
  )
}

export default ProfileUser