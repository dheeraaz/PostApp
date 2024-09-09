import React, { useState } from "react"
import { MdOutlineMail } from "react-icons/md";
import { FiLock, FiUser } from "react-icons/fi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useForm } from 'react-hook-form';

const Registration = ({ updateToggle }) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      age: "",
      email: "",
      password: ""
    }
  })

  const dataSubmit = (data) => {
    console.log("check")
    try {
      console.log(data)
      reset();
    } catch (error) {
      console.error(error)
    }
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

  return (
    <div className="bg-_primary rounded-md pt-8 mx-auto w-[90%] max-w-[400px]">
      <div className="px-4">
        <div className="text-3xl font-semibold text-center bg-gradient-to-br from-blue-400 to-purple-600  text-transparent bg-clip-text">Create Account</div>

        <form action="" onSubmit={handleSubmit(dataSubmit)} className="mt-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <FiUser size={20} /> <input type="text" {...register('username', { required: "Username Is Required"})} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your User Name" autoComplete="off" />
            </div>
            {errors?.username && <p className='text-orange-300 text-sm'>{errors?.username?.message}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
             <input type="number" {...register('age', { required: "Age Is Required", min:{value:12, message:"User must be atleast 12 years old"}})} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Age" autoComplete="off" />
            </div>
            {errors?.age && <p className='text-orange-300 text-sm'>{errors?.age?.message}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <MdOutlineMail size={20} /> <input type="email" {...register('email', { required: "Email Address Is Required", pattern: { value: emailRegex, message: "Invalid email address" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Email Address" autoComplete="off" />
            </div>
            {errors?.email && <p className='text-orange-300 text-sm'>{errors?.email?.message}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <FiLock size={20} />
              <input type={`${isPasswordVisible ? 'text' : 'password'}`} {...register('password', { required: "Password Is Required", minLength: { value: 8, message: "The password length must be atleast 8" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Password" autoComplete="off" />
              <button onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>
            {errors?.password && <p className='text-orange-300 text-sm'>{errors?.password?.message}</p>}
          </div>
          <input type="submit" value="Register" className="bg-_accent px-4 py-2 rounded-md hover:cursor-pointer hover:animate-pulse" />
        </form>
      </div>
      <div className="bg-gray-800 rounded-b-md mt-8 flex justify-center gap-2 p-4 font-light">
        <p>Already have an account? </p>
        <button onClick={() => { updateToggle(1) }} className=' hover:cursor-pointer text-blue-600 hover:underline font-normal'>Login</button>
      </div>

    </div>
  )
}

export default Registration