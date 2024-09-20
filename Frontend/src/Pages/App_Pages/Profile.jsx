import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import CreatePostModal from '../../Components/CreatePostModal.jsx';
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import ProfileCard from '../../Components/ProfileCard.jsx';
import ProfileImageModal from '../../Components/ProfileImageModal.jsx';
import CoverImageModal from '../../Components/CoverImageModal.jsx';

const Profile = () => {
    const { userDetails } = useGlobalAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

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
            <ProfileCard setIsProfileModalOpen={setIsProfileModalOpen} setIsCoverModalOpen={setIsCoverModalOpen}/>
            <CreatePostButton setIsModalOpen={setIsModalOpen} />
            {isModalOpen && <CreatePostModal setIsModalOpen={setIsModalOpen} />}
            {isProfileModalOpen && <ProfileImageModal setIsProfileModalOpen={setIsProfileModalOpen} />}
            {isCoverModalOpen && <CoverImageModal setIsCoverModalOpen={setIsCoverModalOpen} />}
        </>
    )
}

export default Profile