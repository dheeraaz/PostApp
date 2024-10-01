import React, { useEffect, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdDeleteForever } from "react-icons/md";


const MultipleImgUpload = ({ setPostError, postImages, setPostImages }) => {
    const [tempPostImages, setTempPostImages] = useState([]);
    const maximumImgCount = 6;

    const onDrop = useCallback(acceptedFiles => {
        setTempPostImages([...acceptedFiles]);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
    })

    const handleImgDelete = (index) => {
        // we cannot directly update state
        const updatedImages = postImages.filter((_, imgIndex) => imgIndex !== index);
        setPostImages(updatedImages);
    }

    useEffect(() => {
        if (postImages.length < maximumImgCount) {
            setPostError("");
        }

        if (tempPostImages.length > maximumImgCount || postImages.length > maximumImgCount) {
            setPostError(`Cannot upload more than ${maximumImgCount} images`);
            return;
        }

        const validImages = tempPostImages.filter(image => image.type.includes("image"));

        if (validImages.length + postImages.length > maximumImgCount) {
            setPostError(`Cannot upload more than ${maximumImgCount} images`);
            return;
        }
        // Combine previous postImages with new valid images
        setPostImages(prevImages => [...prevImages, ...validImages]);

    }, [tempPostImages]);


    useEffect(() => {
        if (postImages.length < maximumImgCount) {
            setPostError("");
        }
    }, [postImages])

    return (
        <div className=''>
            <div {...getRootProps()} className=' cursor-pointer border-2 border-dashed border-gray-400 w-full h-20 rounded-md flex items-center justify-center'>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p className=' font-_poppins text-gray-400 text-xl'>Drop the files here ...</p> : <div className=' text-center'>
                            <p className=' font-_poppins text-gray-400 text-xl'>Drag and Drop Images or, Browse</p>
                            <p className=' font-_poppins text-sm text-gray-500'>(Upto {maximumImgCount} Images)</p>
                        </div>
                }
            </div>

            {postImages.length > 0 && <div className='w-full py-1 flex gap-2 flex-wrap'>
                {
                    postImages.map((postImg, index) => (
                        <div key={index} className='relative w-[120px] h-[100px]'>
                            {typeof postImg === 'string' && postImg.includes("cloudinary") && <img src={postImg} alt="" className='w-full h-full object-cover' /> }
                            {typeof postImg !== 'string' && <img src={URL.createObjectURL(postImg)} alt="" className='w-full h-full object-cover' />}
                            {/* <img src={URL.createObjectURL(postImg)} alt="" className='w-full h-full object-cover' /> */}
                            <div className='absolute bottom-1 right-1 flex justify-end'>
                                <button onClick={() => handleImgDelete(index)} className='hover:bg-gray-200 p-1 rounded-full group'><MdDeleteForever size={20} className=' group-hover:text-red-500' /></button>
                            </div>
                        </div>
                    ))
                }

            </div>}
        </div>
    )
}

export default MultipleImgUpload