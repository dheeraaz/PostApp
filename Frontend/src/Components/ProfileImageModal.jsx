import React, { useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useGlobalAppContext } from '../Context/AppContext';

const ProfileImageModal = ({ setIsProfileModalOpen }) => {
  const { userDetails } = useGlobalAppContext();
  const inputRef = useRef();
  const [imageError, setImageError] = useState(false);
  const [profilePic, setProfilePic] = useState("");

  const handleImageClick = () => {
    inputRef.current.click();
  }

  const handleImageChange = (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile.type.includes("image")) {
      setImageError(true);
      setProfilePic("");
      return;
    }
    setImageError(false);
    setProfilePic(imgFile);
  }

  const handleUpload = ()=>{
      console.log(profilePic)
  }

  return (
    <div className='w-full min-h-screen backdrop-blur-[1px] absolute top-0 left-0 flex items-center justify-center overflow-hidden '>
      <div className='pb-6 w-[400px] max-w-[90%] mx-auto bg-_primary rounded-md relative'>
        <button onClick={() => setIsProfileModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24} /></button>
        <div className='mt-10'>
          <p className=' text-center text-gray-300'>Upload Your Profile Picture</p>
        </div>

        <div className='flex flex-col justify-center items-center gap-6 mt-3'>
          <div onClick={handleImageClick} className='w-44 h-44 rounded-full cursor-pointer'>

            {
            profilePic ? (<img src={URL.createObjectURL(profilePic)} alt="profile_img" className='w-full h-full rounded-full object-cover' />) : (<img src={userDetails.profilepic} alt="profile_img" className='w-full h-full rounded-full object-cover' />)}
          </div>
          <input type="file" name="profilepic" ref={inputRef} onChange={handleImageChange} className='hidden' />
          <button onClick={handleUpload} disabled={imageError || !profilePic} className={`px-4 py-2 rounded-md  ${(imageError || !profilePic)?"bg-gray-500 cursor-not-allowed":"bg-gradient-to-r from-blue-600  to-purple-600 hover:tracking-wider"}`}>Upload</button>
        </div>
        {imageError && <p className='text-center mt-4 font-_poppins text-red-500 text-sm'>Invalid Image Type</p>}
      </div>
    </div>
  )
}

export default ProfileImageModal