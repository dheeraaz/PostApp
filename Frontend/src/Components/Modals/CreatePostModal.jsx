import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import Tiptap from '../Text-Editor/TipTap';
import parse from 'html-react-parser';
import MultipleImgUpload from '../MultipleImgUpload/MultipleImgUpload';

const CreatePostModal = ({ setIsModalOpen }) => {
  // Tiptap editor content, for lifting state up
  const [editorContent, setEditorContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [postError, setPostError] = useState("");


  // Handle saving the post content
  const handleSave = () => {
    setPostError("");

    if((editorContent==="<p></p>" || editorContent === "") && !postImages.length>0){
      setPostError("Both post content and images cannot be empty");
      return;
    }
    console.log("Editor", editorContent)
    console.log("files", postImages)
    console.log("heeelo")
  }

 

  return (
    <div className='w-full min-h-screen backdrop-blur-[1px] absolute top-0 left-0 flex items-center justify-center z-20 overflow-y-auto'>
      <div className='w-[1000px] max-w-[90%] mx-auto bg-_primary rounded-md absolute top-10 md:top-24 max-h-[60vh] overflow-y-auto _scrollbar-CSS'>
        <button onClick={() => setIsModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24} /></button>

        <div className='mt-11 px-4 mb-2'>
          <Tiptap setEditorContent={setEditorContent} />
        </div>

        <hr className='max-w-[96%] mx-auto mb-2 border-gray-500 h-[1px]' />

        <div className='mb-2 px-4'>
          <MultipleImgUpload setPostError={setPostError} postImages={postImages} setPostImages={setPostImages} />
        </div>

        {postError && <div className='mb-2 px-4'>
          <p className=' text-center text-sm text-red-600 font-_poppins'>{postError}</p>
        </div>}

        <div className='px-4 mb-8 flex items-center justify-end'>
          <button onClick={handleSave} className='bg-blue-500 px-4 py-1 rounded-md'>Save</button>
        </div>
      </div>


    </div>
  )
}

export default CreatePostModal