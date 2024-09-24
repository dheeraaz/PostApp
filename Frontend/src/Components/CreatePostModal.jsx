import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import Tiptap from './Text-Editor/TipTap';
import { useGlobalAppContext } from '../Context/AppContext';
import parse from 'html-react-parser';


const CreatePostModal = ({ setIsModalOpen }) => {

  const { editorContent } = useGlobalAppContext();

  // Handle saving the post content
  const handleSave = () => {
    console.log("Editor content:", editorContent);
    // use while displaying data
    console.log(parse(editorContent))
  }

  return (
    <div className='w-full min-h-screen backdrop-blur-[1px] absolute top-0 left-0 flex items-center justify-center overflow-hidden z-20'>
      <div className='w-[1000px] max-w-[90%] mx-auto bg-_primary rounded-md relative'>
        <button onClick={() => setIsModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24} /></button>

        <div className='mt-11 px-4 pb-2'>
          <Tiptap />
        </div>

        <div className='flex justify-end'>
          <button onClick={handleSave} className='bg-blue-500 px-4 py-1 rounded-md mt-4'>Save</button>
        </div>
      </div>

      
    </div>
  )
}

export default CreatePostModal