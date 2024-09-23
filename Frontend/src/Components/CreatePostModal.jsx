import React from 'react'
import { RxCross2 } from "react-icons/rx";

const CreatePostModal = ({setIsModalOpen}) => {
  return (
    <div className='w-full min-h-screen backdrop-blur-[1px] absolute top-0 left-0 flex items-center justify-center overflow-hidden z-20'>
        <div className='h-[400px] w-[800px] max-w-[90%] mx-auto bg-_primary rounded-md relative'>
          <button onClick={()=>setIsModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24}/></button>
          <p>Just checking</p>

        </div>
      </div>
  )
}

export default CreatePostModal