import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import CreatePostModal from '../../Components/Modals/CreatePostModal.jsx';
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import PostCard from '../../Components/Post-Card/PostCard.jsx'

import { getAllPosts } from '../../Apis/appApi.js';
import { toast } from 'react-toastify';

const Home = () => {
  const { userDetails } = useGlobalAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = 'auto'; // Enable scroll
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const getAllPostsFunction = async () => {
    try {
      const response = await getAllPosts();
      if (response?.status === 200) {
        setAllPosts(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
    }

  }
  useEffect(() => {
    getAllPostsFunction();
  }, [])


  return (
    <>
      <CreatePostButton setIsModalOpen={setIsModalOpen} />
      {isModalOpen && <CreatePostModal setIsModalOpen={setIsModalOpen} />}

      {/* posts */}
      {allPosts?.length > 0 && allPosts.map((post)=>{
          return <PostCard post = {post}/>
      }) }
    </>
  )
}

export default Home