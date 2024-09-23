import React from 'react'
import { FaCamera } from "react-icons/fa6";
import { useGlobalAppContext } from '../Context/AppContext';


const ProfileCard = ({setIsProfileModalOpen, setIsCoverModalOpen}) => {
    const { userDetails } = useGlobalAppContext();

    return (
        <div className='mb-2 max-w-[90%] w-[600px] mx-auto bg-_primary rounded-md shadow-md pt-4 px-4 pb-6'>
            <div className='w-full h-[200px] rounded-md relative'>
                <img src={userDetails.coverpic} alt="" className='w-full h-full object-cover rounded-md ' />

                <div className='absolute bottom-2 right-2'>
                    <button onClick={()=>setIsCoverModalOpen(true)} className='bg-gray-500 p-2 flex gap-2 items-center rounded-md font-_roboto hover:bg-gray-400'><FaCamera size={18} /> <p>Add New Photo</p></button>
                </div>

                <div className='absolute -bottom-8 left-4 w-24 h-24 rounded-full p-[2px] bg-gray-400'>
                    <img src={userDetails.profilepic} alt="prfile_img" className='w-full h-full rounded-full bg-gray-700 object-cover' />

                    <div className='absolute bottom-0 right-0'>
                        <button onClick={()=>setIsProfileModalOpen(true)} className='bg-gray-500 p-[6px] rounded-full hover:bg-gray-400'><FaCamera size={18} /></button>
                    </div>
                </div>
            </div>

            <div className='ml-32 mt-2 font-_poppins'>
                <p className='text-xl font-semibold'>{userDetails.username}</p>
                <p className='text-base font-light text-gray-400'>{userDetails.posts.length} Posts</p>
            </div>

            <hr className='mt-4 border-gray-500 h-[1px]' />

        </div>
    )
}

export default ProfileCard