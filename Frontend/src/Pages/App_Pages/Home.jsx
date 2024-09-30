import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import CreatePostModal from '../../Components/Modals/CreatePostModal.jsx';
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import PostCard from '../../Components/Post-Card/PostCard.jsx'

const Home = () => {
  const { allPosts,getAllPostsFunction } = useGlobalAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      {isModalOpen && <CreatePostModal setIsModalOpen={setIsModalOpen} />}

      {/* posts */}
      {allPosts?.length > 0 ? (allPosts.map((post, index) => {
        return <PostCard key={index} post={post} />
      })):(
        <div className='text-center'>
          <p className='text-gray-500'>No Posts Available</p>
        </div>
      )}
    </>
  )
}

export default Home