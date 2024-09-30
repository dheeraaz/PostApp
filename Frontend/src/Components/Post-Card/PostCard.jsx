import React from 'react'
import { Link } from 'react-router-dom';
import { format } from "date-fns"
import Carousel from '../Carousel/Carousel.jsx';
import { BsHeart, BsHeartFill, BsHeartbreak, BsHeartbreakFill } from "react-icons/bs";
import parse from 'html-react-parser';
import './PostCard.css'
import { useGlobalAppContext } from '../../Context/AppContext.jsx';

{/* <BsHeart /> */ }
{/* <BsHeartFill /> */ }
{/* <BsHeartbreak /> */ }
{/* <BsHeartbreakFill /> */ }


const PostCard = ({ post }) => {
    const { userDetails } = useGlobalAppContext();

    return (
        <div className='max-w-[90%] w-[600px] mx-auto bg-_primary rounded-md shadow-md px-4 py-4 mt-2'>
            <div className='flex gap-2 items-center'>
                <Link
                    to='/home/profile'
                    className='w-10 h-10 min-h-[40px] min-w-[40px] rounded-full'
                >
                    <img src={post.user.profilepic} alt="profile_img" className='w-full h-full rounded-full bg-gray-700 object-cover aspect-square' />
                </Link>

                <div>
                    <p className='text-lg'>{post.user.username}</p>
                    <p className=' text-sm font-medium text-gray-400'>{format(new Date(post.updatedAt), 'MMMM dd, yyyy')}</p>
                </div>
            </div>

            <div className='mt-1 _post-Content'>
                {/* <p>{post.content}</p> */}
                <p>{parse(post.content)}</p>
            </div>
            {/* <hr className='mt-4 border-gray-500 h-[1px]' /> */}

            {post?.postimgs?.length > 0 && <div
                className='mt-2 border-[1px] rounded-md w-full max-h-[500px] h-[500px] px-4 flex items-center justify-center'
                style={{ borderColor: post.theme }}
            >
                <Carousel slides={post.postimgs} />
            </div>}

            <div className='border-y-[1px] border-gray-500 mt-2 flex items-center justify-between gap-1 py-1'>
                <button className='w-full flex justify-center items-center gap-2 py-2 rounded-md hover:bg-gray-600'>
                    <BsHeart size={20} style={{ color: post.theme }} />
                    <p>Like</p>
                </button>
                <button className='w-full flex justify-center items-center gap-2 py-2 rounded-md hover:bg-gray-600'>
                    <BsHeartbreak size={20} style={{ color: post.theme }} />
                    <p>Dislike</p>
                </button>
            </div>

        </div>
    )
}

export default PostCard