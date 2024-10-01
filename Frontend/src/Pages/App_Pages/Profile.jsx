import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import CreatePostModal from '../../Components/Modals/CreatePostModal.jsx';
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import ProfileCard from '../../Components/ProfileCard.jsx';
import ProfileImageModal from '../../Components/Modals/ProfileImageModal.jsx';
import CoverImageModal from '../../Components/Modals/CoverImageModal.jsx'

import { getUserPosts } from '../../Apis/appApi.js';
import PostCard from '../../Components/Post-Card/PostCard.jsx';

const Profile = () => {
    const { userDetails } = useGlobalAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [ownPosts, setOwnPosts] = useState([]);


    const getOwnPostsFunction = async () => {
        try {
            const response = await getUserPosts(userDetails._id);
            if (response?.status === 200) {
                setOwnPosts(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
        }
    }
    useEffect(() => {
        getOwnPostsFunction();
    },[])

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
            <ProfileCard setIsProfileModalOpen={setIsProfileModalOpen} setIsCoverModalOpen={setIsCoverModalOpen} postCount = {ownPosts.length} profileId={userDetails._id}/>
            <CreatePostButton setIsModalOpen={setIsModalOpen}/>
            {isModalOpen && <CreatePostModal setIsModalOpen={setIsModalOpen} getOwnPostsFunction= {getOwnPostsFunction} />}
            {isProfileModalOpen && <ProfileImageModal setIsProfileModalOpen={setIsProfileModalOpen} />}
            {isCoverModalOpen && <CoverImageModal setIsCoverModalOpen={setIsCoverModalOpen} />}

            {/* posts */}
            {ownPosts?.length > 0 ? (ownPosts.map((post, index) => {
                return <PostCard key={index} post={post} getOwnPostsFunction= {getOwnPostsFunction} />
            })) : (
                <div className='text-center'>
                    <p className='text-gray-500'>No Posts Available</p>
                </div>
            )}
        </>
    )
}

export default Profile