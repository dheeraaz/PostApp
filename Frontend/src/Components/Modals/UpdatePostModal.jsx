import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import Tiptap from '../Text-Editor/TipTap';
import MultipleImgUpload from '../MultipleImgUpload/MultipleImgUpload';
import ThemeSelector from '../ThemeSelector.jsx';

import { getSinglePost, updatePost } from '../../Apis/appApi.js';
import { toast } from 'react-toastify';

const UpdatePostModal = ({ setIsUpdateModalOpen, currentPostId, getAllPostsFunction, getOwnPostsFunction }) => {
  // Tiptap editor content, for lifting state up
  const [editorContent, setEditorContent] = useState("");
  const [postImages, setPostImages] = useState([]);
  const [theme, setTheme] = useState("#f2f2f2")
  const [postError, setPostError] = useState();
  const [isUploading, setIsUploading] = useState(false);

  // these two states are used for validating and checking if any changes were made in new post or not
  const [singlePost, setSinglePost] = useState({});
  const [previosImages, setPreviousImages] = useState([])

  // handling theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };


  // Handle saving the post content
  const handleCreate = async () => {
    setPostError("");


    if ((singlePost.theme === theme) && (singlePost.content === editorContent) && (JSON.stringify(previosImages) === JSON.stringify(postImages))) {
      toast.error("No changes were made");
      return
    }

    if ((editorContent === "<p></p>" || editorContent === "") && !postImages.length > 0) {
      setPostError("Both post content and images cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("content", editorContent);

    postImages.forEach((image) => {
      // formData.append("postimgs", image);

      if (typeof image === 'string' && image.includes("cloudinary")) {
        formData.append("previousimgs", image)
      }

      if (typeof image !== 'string') {
        formData.append('newimgfiles', image)
      }
    });
    formData.append("theme", theme);

    try {
      setIsUploading(true);

      const response = await updatePost({ frontendData: formData, postId: currentPostId });

      if (response?.status === 200) {
        toast.success(response?.data?.message);

        if (getOwnPostsFunction) {
          getOwnPostsFunction();
        }

        if (getAllPostsFunction) {
          getAllPostsFunction();
        }

        setIsUpdateModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error in creating post")
    } finally {
      setIsUploading(false);
    }


  }

  const getSinglePostFunction = async (id) => {
    try {
      const response = await getSinglePost(id);
      if (response?.status === 200) {
        setSinglePost(response?.data?.data)
        setEditorContent(response?.data?.data?.content);
        setTheme(response?.data?.data?.theme);

        if (response?.data?.data?.postimgs.length > 0) {
          const images = response?.data?.data?.postimgs?.map((img) => { return img.secure_url })
          setPostImages(images);
          setPreviousImages(images)
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
    }
  }

  useEffect(() => {
    getSinglePostFunction(currentPostId);
  }, [currentPostId])



  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-screen min-h-screen flex items-center justify-center z-20 overflow-y-auto backdrop-blur-[1px]'>
      <div className='w-[1000px] max-w-[90%] mx-auto bg-_primary rounded-md  max-h-[70vh] overflow-y-auto _scrollbar-CSS z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <button onClick={() => setIsUpdateModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24} /></button>

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
        <ThemeSelector handleThemeChange={handleThemeChange} theme={theme} />

        {postError && <div className='mb-2 px-4'>
          <p className=' text-center text-sm text-red-600 font-_poppins'>{postError}</p>
        </div>}

        <div className='px-4 mb-8 flex items-center justify-end'>
          <button onClick={handleCreate} disabled={isUploading} className={`px-4 py-1 rounded-md ${isUploading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"} `}>Update Post</button>
        </div>
      </div>


    </div>
  )
}

export default UpdatePostModal