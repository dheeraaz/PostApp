import React from 'react'
import { GoDotFill } from "react-icons/go";


const ThemeSelector = ({handleThemeChange, theme}) => {
  return (
    <div className='mb-2 px-4 flex items-center gap-2'>
          <p>Theme: </p>
          <div className='flex items-center'>
            <label className="relative">
              <input
                type="radio"
                name="theme"
                id="theme1"
                value="#f2f2f2"
                checked={theme ? theme === "#f2f2f2" : true}
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
                checked={theme === "#4a86d4"}
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
                checked={theme === "#bb86fc"}
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
                checked={theme === "#03dac6"}
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
                checked={theme === "#ffc436"}
                onChange={handleThemeChange}
                className="peer hidden"
              />
              <div className=" cursor-pointer w-8 h-8 bg-transparent rounded-full border-2 border-transparent flex items-center justify-center peer-checked:border-[#ffc436]">
                <GoDotFill className='text-[#ffc436] w-full h-full' />
              </div>
            </label>
          </div>
        </div>
  )
}

export default ThemeSelector