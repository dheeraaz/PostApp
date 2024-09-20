import React, { useEffect, useState } from 'react'
import { useGlobalAppContext } from '../../Context/AppContext';
import CreatePostModal from '../../Components/CreatePostModal.jsx';
import CreatePostButton from '../../Components/CreatePostButton.jsx';
import ProfileCard from '../../Components/ProfileCard.jsx';

const Profile = () => {
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
            <ProfileCard />
            <CreatePostButton setIsModalOpen={setIsModalOpen} />
            {isModalOpen && <CreatePostModal setIsModalOpen={setIsModalOpen} />}
        </>
    )
}

export default Profile