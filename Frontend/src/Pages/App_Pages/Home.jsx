import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import { Link } from 'react-router-dom';
import CreatePost from '../../Components/CreatePost';

const Home = () => {
  const { userDetails } = useGlobalAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className='max-w-[90%] w-[600px] mx-auto bg-_primary rounded-md shadow-md px-4 py-8'>
        <div className='flex gap-2'>
          <Link
            to='/home/profile'
            className='inline-block max-w-10 max-h-10 rounded-full'
          >
            <img src={userDetails.profilepic} alt="prfile_img" className='w-full h-full rounded-full bg-gray-700' />
          </Link>
          <button onClick={()=>setIsModalOpen(true)} className='bg-gray-600 w-full p-2 rounded-full text-gray-400 text-left pl-4 hover:bg-gray-500'>
            What's on your mind, {userDetails.username.split(" ")[0]}?
          </button>
        </div>
        <hr className='mt-4 border-gray-500 h-[1px]' />
      </div>
      {isModalOpen && <CreatePost setIsModalOpen={setIsModalOpen}/>}
    </>
  )
}

export default Home