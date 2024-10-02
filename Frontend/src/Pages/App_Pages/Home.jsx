import React, { useEffect, useState } from 'react'
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import CreatePostModal from '../../Components/Modals/CreatePostModal.jsx';
import PostCard from '../../Components/Post-Card/PostCard.jsx'
import { getAllPosts } from '../../Apis/appApi.js';
import { toast } from 'react-toastify';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState([]);


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


  const deletePostFromHome = (postId) => {
    // Removing the post from allPosts by filtering it out
    setAllPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
  }

  useEffect(() => {
    getAllPostsFunction();
  }, [])


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


  return (
    <>
      <CreatePostButton setIsModalOpen={setIsModalOpen} />
      {isModalOpen && <CreatePostModal setIsModalOpen={setIsModalOpen} getAllPostsFunction={getAllPostsFunction} />}

      {/* posts */}
      {allPosts?.length > 0 ? (allPosts.map((post) => {
        return <PostCard key={post._id} post={post} deletePostFromHome={deletePostFromHome} getAllPostsFunction={getAllPostsFunction} />
      })) : (
        <div className='text-center'>
          <p className='text-gray-500'>No Posts Available</p>
        </div>
      )}
    </>
  )
}

export default Home