import React, { useState } from "react"
import { MdOutlineMail } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Apis/authApi.js";
import { toast } from "react-toastify";
import { useGlobalAppContext } from "../../Context/AppContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoggedIn } = useGlobalAppContext();


  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const dataSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await loginUser(data);
      if (response.status === 200) {
        reset();
        if (response?.data?.statusCode === 202) { //202 status code is for registered but unverified user
          toast.info(response?.data?.message);
          navigate('/verifyemail')
        } else {
          toast.success(response?.data?.message);
          setIsLoggedIn(true);
          navigate('/home')
        }
      }
    } catch (error) {
      if (error?.response?.data?.name === "Validation Error") {
        toast.error(error?.response?.data?.errors[0]?.message || "Form validation Error")
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Error In Login")
      }
    } finally {
      setIsSubmitting(false)
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return (
    <div className="bg-_primary rounded-md pt-8 mx-auto w-[90%] max-w-[400px]">
      <div className="px-4">
        <div className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-600  text-transparent bg-clip-text">Welcome Back</div>

        <form action="" onSubmit={handleSubmit(dataSubmit)} className="mt-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <MdOutlineMail size={20} /> <input type="email" {...register('email', { required: "Email Address Is Required", pattern: { value: emailRegex, message: "Invalid email address" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Email Address" autoComplete="off" />
            </div>
            {errors?.email && <p className='text-orange-300 text-sm'>{errors?.email?.message}</p>}
          </div>
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <FiLock size={20} />
              <input type='password' {...register('password', { required: "Password Is Required", minLength: { value: 8, message: "The password length must be atleast 8" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Password" autoComplete="off" />
            </div>
            {errors?.password && <p className='text-orange-300 text-sm'>{errors?.password?.message}</p>}
          </div>
          <input type="submit" disabled={isSubmitting} value={`${isSubmitting ? "Logging..." : "Login"}`} className={`px-4 py-2 rounded-md ${isSubmitting ? 'cursor-not-allowed bg-gray-600' : 'bg-_accent hover:cursor-pointer hover:animate-pulse'}`} />

        </form>
        <div className="flex justify-end">
          <button onClick={() => navigate('/forgotpassword')} className="w-fit mt-2 font-light hover:underline hover:font-normal">Forgot Password?</button>
        </div>
      </div>
      <div className="bg-gray-800 rounded-b-md mt-8 flex justify-center gap-2 p-4 font-light">
        <p>Don't have an account? </p>
        <button onClick={() => navigate('/registration')} className=' hover:cursor-pointer text-blue-600 hover:underline font-normal'>Sign Up</button>
      </div>
    </div>
  )
}

export default Login