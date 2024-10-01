import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import Tiptap from '../Text-Editor/TipTap';
import MultipleImgUpload from '../MultipleImgUpload/MultipleImgUpload';
import ThemeSelector from '../ThemeSelector.jsx';
import parse from 'html-react-parser';
import { GoDotFill } from "react-icons/go";

import { createPost } from '../../Apis/appApi.js';
import { toast } from 'react-toastify';
import { useGlobalAppContext } from '../../Context/AppContext.jsx';

const CreatePostModal = ({ setIsModalOpen, getAllPostsFunction, getOwnPostsFunction }) => {
  // Tiptap editor content, for lifting state up
  const [editorContent, setEditorContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [theme, setTheme] = useState("#f2f2f2")
  const [postError, setPostError] = useState();
  const [isUploading, setIsUploading] = useState(false);

  // handling theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };


  // Handle saving the post content
  const handleCreate = async () => {
    setPostError("");

    if ((editorContent === "<p></p>" || editorContent === "") && !postImages.length > 0) {
      setPostError("Both post content and images cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("content", editorContent);

    postImages.forEach((image) => {
      formData.append("postimgs", image);
    });
    formData.append("theme", theme);

    try {
      setIsUploading(true);

      const response = await createPost(formData);

      if (response?.status === 200) {
        toast.success(response?.data?.message);
        
        setIsModalOpen(false);
        
        if (getOwnPostsFunction) {
          getOwnPostsFunction();
        }
        
        if (getAllPostsFunction) {
          getAllPostsFunction();
        }

      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error in creating post")
    } finally {
      setIsUploading(false);
    }
  }


  return (
    <div className='w-full min-h-screen backdrop-blur-[1px] absolute top-0 left-0 flex items-center justify-center z-20 overflow-y-auto'>
      <div className='w-[1000px] max-w-[90%] mx-auto bg-_primary rounded-md absolute top-10 md:top-24 max-h-[70vh] overflow-y-auto _scrollbar-CSS'>
        <button onClick={() => setIsModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24} /></button>

        {/* Text Editor */}
        <div className='mt-11 px-4 mb-2'>
          <Tiptap editorContent={editorContent} setEditorContent={setEditorContent} />
        </div>

        <hr className='max-w-[96%] mx-auto mb-2 border-gray-500 h-[1px]' />

        {/* Image Upload option */}
        <div className='mb-2 px-4'>
          <MultipleImgUpload setPostError={setPostError} postImages={postImages} setPostImages={setPostImages} />
        </div>

        {/* Theme Selection Option */}
        {/* <div className='mb-2 px-4 flex items-center gap-2'>
          <p>Theme: </p>
          <div className='flex items-center'>
            <label className="relative">
              <input
                type="radio"
                name="theme"
                id="theme1"
                defaultChecked
                value="#f2f2f2"
                onChange={handleThemeChange}
                className="peer hidden"
              />
              <div className="cursor-pointer w-8 h-8 bg-transparent rounded-full border-2 border-transparent flex items-center justify-center peer-checked:border-[#f2f2f2]">
                <GoDotFill className='text-[#f2f2f2] w-full h-full' />
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="theme"
                id="theme2"
                value="#4a86d4"
                onChange={handleThemeChange}
                className="peer hidden"
              />
              <div className=" cursor-pointer w-8 h-8 bg-transparent rounded-full border-2 border-transparent flex items-center justify-center peer-checked:border-[#4a86d4]">
                <GoDotFill className='text-[#4a86d4] w-full h-full' />
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="theme"
                id="theme3"
                value="#bb86fc"
                onChange={handleThemeChange}
                className="peer hidden"
              />
              <div className=" cursor-pointer w-8 h-8 bg-transparent rounded-full border-2 border-transparent flex items-center justify-center peer-checked:border-[#bb86fc]">
                <GoDotFill className='text-[#bb86fc] w-full h-full' />
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="theme"
                id="theme4"
                value="#03dac6"
                onChange={handleThemeChange}
                className="peer hidden"
              />
              <div className=" cursor-pointer w-8 h-8 bg-transparent rounded-full border-2 border-transparent flex items-center justify-center peer-checked:border-[#03dac6]">
                <GoDotFill className='text-[#03dac6] w-full h-full' />
              </div>
            </label>

            <label className="relative">
              <input
                type="radio"
                name="theme"
                id="theme4"
                value="#ffc436"
                onChange={handleThemeChange}
                className="peer hidden"
              />
              <div className=" cursor-pointer w-8 h-8 bg-transparent rounded-full border-2 border-transparent flex items-center justify-center peer-checked:border-[#ffc436]">
                <GoDotFill className='text-[#ffc436] w-full h-full' />
              </div>
            </label>
          </div>
        </div> */}

        <ThemeSelector handleThemeChange={handleThemeChange}/>

        {postError && <div className='mb-2 px-4'>
          <p className=' text-center text-sm text-red-600 font-_poppins'>{postError}</p>
        </div>}

        <div className='px-4 mb-8 flex items-center justify-end'>
          <button onClick={handleCreate} disabled={isUploading} className={`px-4 py-1 rounded-md ${isUploading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"} `}>Create Post</button>
        </div>
      </div>


    </div>
  )
}

export default CreatePostModal