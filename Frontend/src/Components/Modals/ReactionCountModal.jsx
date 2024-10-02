import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { BsHeartFill, BsHeartbreakFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useGlobalAppContext } from '../../Context/AppContext';

const ReactionCountModal = ({ setIsReactionCountModalOpen, theme, likedDetails, dislikedDetails }) => {
  const { userDetails } = useGlobalAppContext();
  const navigate = useNavigate();

  return (
    <div className='w-full px-2 pb-2 max-h-[200px] rounded-md bg-_primary border-2 overflow-y-auto _scrollbar-CSS' style={{ borderColor: theme }}>
      <div className='flex justify-end mb-2 pt-2'>
        <button onClick={() => setIsReactionCountModalOpen(false)} className='rounded-full p-1 hover:bg-gray-600'><RxCross2 size={20} /></button>
      </div>

      {likedDetails.length > 0 && likedDetails.map((user) => {
        return <div key={user._id} onClick={() => navigate(userDetails._id === user._id ? '/home/profile' : `/home/profile/user/${user._id}`)} className='w-full rounded-md mx-auto flex items-center gap-2 group cursor-pointer mt-1'>
          <div
            className='w-9 h-9 min-h-9 min-w-9 rounded-full'
          >
            <img src={user.profilepic} alt="profile_img" className='w-full h-full rounded-full bg-gray-700 object-cover aspect-square' />
          </div>

          <div className='group-hover:bg-gray-700 rounded-md flex-1 pl-2 py-1'>
            <p className='text-sm mb-1'>{user.username}</p>
            <BsHeartFill size={16} style={{ color: theme }} />
          </div>
        </div>
      })
      }

      {dislikedDetails.length > 0 && dislikedDetails.map((user) => {
        return <div key={user._id} className='w-full rounded-md mx-auto flex items-center gap-2 group cursor-pointer mt-1'>
          <div
            className='w-10 h-10 min-h-[40px] min-w-[40px] rounded-full'
          >
            <img src={user.profilepic} alt="profile_img" className='w-full h-full rounded-full bg-gray-700 object-cover aspect-square' />
          </div>

          <div className='group-hover:bg-gray-700 rounded-md flex-1 pl-2 py-1'>
            <p className='text-sm mb-1'>{user.username}</p>
            <BsHeartbreakFill size={16} style={{ color: theme }} />
          </div>
        </div>
      })
      }

    </div>
  )
}

export default ReactionCountModal