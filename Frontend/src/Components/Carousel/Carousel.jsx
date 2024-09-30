import React, { useState } from 'react'
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";


const Carousel = ({ slides }) => {

    let [current, setCurrent] = useState(0);

    let previousSlide = () => {
        if (current === 0) setCurrent(slides.length - 1);
        else setCurrent(current - 1);
    }

    let nextSlide = () => {
        if (current === (slides.length - 1)) setCurrent(0);
        else setCurrent(current + 1);
    }

    return (
        <div className='overflow-hidden relative w-full h-full py-4 '>
            <div className={`w-full h-full flex transition-all ease-out duration-500`} style={{ transform: `translateX(-${current * 100}%)` }}>
                {slides.map((s, index) => {
                    return <div key={index} className='min-w-full h-full'>
                        <img src={s.secure_url} alt={`postImg_${index}`} className='w-full h-full object-contain' />
                    </div>
                })}
            </div>

            {slides.length > 1 && <div className='absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between px-4'>
                <button onClick={previousSlide} className='bg-gray-500 p-2 rounded-full flex items-center justify-center hover:bg-gray-400'>
                    <FaChevronLeft />
                </button>
                <button onClick={nextSlide} className='bg-gray-500 p-2 rounded-full flex items-center justify-center hover:bg-gray-400'>
                    <FaChevronRight />
                </button>
            </div>}

            {/* navigation circles */}

            {slides.length>1 && <div className='absolute bottom-0 pb-8 w-full flex gap-2 justify-center items-center'>
                {
                    slides.map((s,index)=>{
                        return <div onClick={()=>setCurrent(index)} key={index} className={`rounded-full  transition-all duration-300 cursor-pointer ${index===current ? "bg-white w-3 h-3":"bg-gray-500 hover:scale-125 hover:bg-white w-2 h-2 "}`}></div>
                    })
                }
            </div>}
        </div>
    )
}

export default Carousel