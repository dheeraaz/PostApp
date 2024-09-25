import React from 'react'
import { Link } from 'react-router-dom';
import { format } from "date-fns"
import Carousel from '../Carousel/Carousel.jsx';
import { BsHeart, BsHeartFill, BsHeartbreak, BsHeartbreakFill } from "react-icons/bs";
import parse from 'html-react-parser';
import './PostCard.css' 

{/* <BsHeart /> */ }
{/* <BsHeartFill /> */ }
{/* <BsHeartbreak /> */ }
{/* <BsHeartbreakFill /> */ }

const post = {
    user: {
        _id: "66ed0b0085cca36cd7c12b0b",
        username: "Tyrion Thapa",
        profilepic: "http://res.cloudinary.com/dhirajcloudinary/image/upload/v1727070251/oomthq2kf88mtly3ofgi.jpg",
    },
    content: "Lorem ipsum dolor sit amet. In rhoncus vitae elit quis vestibulum. Vestibulum vel augue diam. Fusce dictum ac risus quis hendrerit. Aenean efficitur diam ut elit pretium, eget porta urna mattis. Curabitur in eleifend orci. Nam posuere, nulla sit amet blandit tempor, ipsum sem porta leo, dignissim congue eros dolor nec libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    postimgs: ["https://images.unsplash.com/photo-1726672460396-cd3e7ff2453f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1726828952256-293d9b81ff2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1726853522009-8dc4c4e306a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxN3x8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1726309356095-e4c9be366c13?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1726487536376-846cd82fbd78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D"],
    // theme: "#f2f2f2",
    // theme: "#4a86d4",
    // theme: "#bb86fc",
    // theme: "#03dac6",
    theme: "#ffc436",
    updatedAt: "2024-09-23T06:10:51.873+00:00",
    likedby: ["jkhj", 'jklj'],
    dislikedby: ["hkhjk", "hhk"],
}

const PostCard = () => {

    return (
        <div className='max-w-[90%] w-[600px] mx-auto bg-_primary rounded-md shadow-md px-4 py-4 mt-2'>
            <div className='flex gap-2 items-center'>
                <Link
                    to='/home/profile'
                    className='w-10 h-10 min-h-[40px] min-w-[40px] rounded-full'
                >
                    <img src={post.user.profilepic} alt="prfile_img" className='w-full h-full rounded-full bg-gray-700 object-cover aspect-square' />
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