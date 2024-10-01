import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { format } from "date-fns"
import Carousel from '../Carousel/Carousel.jsx';
import { BsHeart, BsHeartFill, BsHeartbreak, BsHeartbreakFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import parse from 'html-react-parser';
import './PostCard.css'
import { useGlobalAppContext } from '../../Context/AppContext.jsx';
import { deletePost } from '../../Apis/appApi.js';
import { toast } from 'react-toastify';
import UpdatePostModal from '../Modals/UpdatePostModal.jsx';


{/* <BsHeart /> */ }
{/* <BsHeartFill /> */ }
{/* <BsHeartbreak /> */ }
{/* <BsHeartbreakFill /> */ }


const PostCard = ({ post, deletePostFromHome, deletePostFromProfile, getOwnPostsFunction, getAllPostsFunction}) => {
    const { userDetails } = useGlobalAppContext();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null); //state to store the post id of post which need to be updated


    const openUpdateModal = (postId) => {
        setCurrentPostId(postId); // Set the post ID to be updated
        setIsUpdateModalOpen(true); // Open the update modal
    };

    const deletePostFunction = async (id) => {
        try {
            const response = await deletePost(id)
            if (response?.status === 200) {
                if (deletePostFromHome) {
                    // deleting post from allPosts state in home page
                    deletePostFromHome(id);
                }

                if (deletePostFromProfile) {
                    // deleting post from ownPosts state in profile page
                    deletePostFromProfile(id);
                }

                toast.success(response?.data?.message)
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
        }
    }



    return (
        post && (<div className='max-w-[90%] w-[600px] mx-auto bg-_primary rounded-md shadow-md px-4 py-4 mb-2'>
            <div className='flex justify-between relative'>
                <div className='flex gap-2 items-center'>
                    <Link
                        to={`${userDetails._id === post.user._id ? '/home/profile' : `/home/profile/user/${post.user._id}`}`}
                        className='w-10 h-10 min-h-[40px] min-w-[40px] rounded-full'
                    >
                        <img src={post.user.profilepic} alt="profile_img" className='w-full h-full rounded-full bg-gray-700 object-cover aspect-square' />
                    </Link>

                    <div>
                        <p className='text-lg'>{post.user.username}</p>
                        <p className=' text-sm font-medium text-gray-400'>{format(new Date(post.updatedAt), 'MMMM dd, yyyy')}</p>
                    </div>
                </div>

                {userDetails._id === post.user._id && <div className='flex justify-between gap-2'>
                    <button onClick={() => openUpdateModal(post._id)} className='w-fit h-fit pb-1 hover:border-b-2' style={{ borderColor: post.theme }}>
                        <FiEdit size={24} style={{ color: post.theme }} />
                    </button>
                    <button onClick={() => deletePostFunction(post._id)} className='w-fit h-fit pb-[2px] border-b-2 border-transparent hover:border-red-500 '>
                        <MdDeleteOutline size={26} className='text-red-500' />
                    </button>

                </div>}

                {/* update post modal */}
                {isUpdateModalOpen && <UpdatePostModal setIsUpdateModalOpen={setIsUpdateModalOpen} currentPostId={currentPostId} getAllPostsFunction={getAllPostsFunction} getOwnPostsFunction={getOwnPostsFunction} />}

            </div>

            <div className='mt-1 _post-Content'>
                {/* <p>{post.content}</p> */}
                {parse(post.content)}
            </div>
            {/* <hr className='mt-4 border-gray-500 h-[1px]' /> */}

            {post?.postimgs?.length > 0 && <div
                className='mt-2 border-[1px] rounded-md w-full max-h-[500px] h-[500px] px-4 flex items-center justify-center'
                style={{ borderColor: post.theme }}
            >
                <Carousel slides={post.postimgs} />
            </div>}

            {userDetails._id !== post.user._id && <div className='border-y-[1px] border-gray-500 mt-2 flex items-center justify-between gap-1 py-1'>
                <button className='w-full flex justify-center items-center gap-2 py-2 rounded-md hover:bg-gray-600'>
                    <BsHeart size={20} style={{ color: post.theme }} />
                    <p>Like</p>
                </button>
                <button className='w-full flex justify-center items-center gap-2 py-2 rounded-md hover:bg-gray-600'>
                    <BsHeartbreak size={20} style={{ color: post.theme }} />
                    <p>Dislike</p>
                </button>
            </div>}

        </div>)
    )
}

export default PostCard