import React, { useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useGlobalAppContext } from '../../Context/AppContext';
import { toast } from 'react-toastify';
import { uploadCoverPic } from '../../Apis/appApi';

const CoverImageModal = ({ setIsCoverModalOpen }) => {
  const { userDetails, setUserDetails } = useGlobalAppContext();
  const inputRef = useRef();
  const [imageError, setImageError] = useState(false);
  const [coverPic, setCoverPic] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    inputRef.current.click();
  }

  const handleImageChange = (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile.type.includes("image")) {
      setImageError(true);
      setCoverPic("");
      return;
    }
    setImageError(false);
    setCoverPic(imgFile);
  }

  const handleUpload = async() => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('coverpic', coverPic);
      formData.append('originalCoverUrl', userDetails.coverpic);

      const response = await uploadCoverPic(formData);

      if (response?.status === 200) {
        setUserDetails(response?.data?.data);
        toast.success(response?.data?.message);
        setIsCoverModalOpen(false);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error in uploading image")
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className='w-full min-h-screen backdrop-blur-[1px] absolute top-0 left-0 flex items-center justify-center overflow-hidden z-20'>
      <div className='pb-6 w-[400px] max-w-[90%] mx-auto bg-_primary rounded-md relative'>
        <button onClick={() => setIsCoverModalOpen(false)} className='absolute top-3 right-3 rounded-full p-1 hover:bg-gray-600'><RxCross2 size={24} /></button>
        <div className='mt-10'>
          <p className=' text-center text-gray-300'>Upload Your Cover Photo</p>
        </div>

        <div className='flex flex-col justify-center items-center gap-6 mt-3 px-4'>
          <div onClick={handleImageClick} className='w-full h-44 rounded-md cursor-pointer'>

            {
              coverPic ? (<img src={URL.createObjectURL(coverPic)} alt="profile_img" className='w-full h-full rounded-md object-cover' />) : (<img src={userDetails.coverpic} alt="profile_img" className='w-full h-full rounded-md object-cover' />)}
          </div>
          <input type="file" name="coverPic" ref={inputRef} accept="image/*" onChange={handleImageChange} className='hidden' />
          <button onClick={handleUpload} disabled={imageError || !coverPic || isUploading} className={`px-4 py-2 rounded-md  ${(imageError || !coverPic || isUploading) ? "bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-600  to-purple-600 hover:tracking-wider"}`}>{isUploading ? "Uploading..." : "Upload"}</button>
        </div>
        {imageError && <p className='text-center mt-4 font-_poppins text-red-500 text-sm'>Invalid Image Type</p>}
      </div>
    </div>
  )
}

export default CoverImageModal