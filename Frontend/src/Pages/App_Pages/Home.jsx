import React, { useEffect, useState } from 'react'
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import CreatePostModal from '../../Components/Modals/CreatePostModal.jsx';
import UpdatePostModal from '../../Components/Modals/UpdatePostModal.jsx'
import PostCard from '../../Components/Post-Card/PostCard.jsx'
import { getAllPosts } from '../../Apis/appApi.js';
import { toast } from 'react-toastify';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [currentPostId, setCurrentPostId] = useState(null); //state to store the post id of post which need to be updated

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

  const openUpdateModal = (postId) => {
    setCurrentPostId(postId); // Set the post ID to be updated
    setIsUpdateModalOpen(true); // Open the update modal
  };

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
      {isUpdateModalOpen && <UpdatePostModal setIsUpdateModalOpen={setIsUpdateModalOpen} currentPostId={currentPostId} getAllPostsFunction={getAllPostsFunction} />}

      {/* posts */}
      {allPosts?.length > 0 ? (allPosts.map((post, index) => {
        return <PostCard key={index} post={post} deletePostFromHome={deletePostFromHome} openUpdateModal={openUpdateModal} />
      })) : (
        <div className='text-center'>
          <p className='text-gray-500'>No Posts Available</p>
        </div>
      )}
    </>
  )
}

export default Home