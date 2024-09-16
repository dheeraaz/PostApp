import React, { useState } from "react"
import { FiLock } from "react-icons/fi";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from '../../Apis/authApi.js'
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { pwdResetToken } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate()

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
      confirm_password: ""
    }
  })

  const dataSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await resetPassword({ ...data, pwdResetToken })
      console.log("====>",response)
      if (response?.data?.statusCode === 204) {
        toast.success(response?.data?.message);
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.data?.name === "Validation Error") {
        toast.error(error?.response?.data?.errors[0]?.message || "Form validation Error")
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Error In Password Reset")
      }
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div className="bg-_primary rounded-md py-8 mx-auto w-[90%] max-w-[400px]">
      <div className="px-4">
        <div className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-600  text-transparent bg-clip-text">Reset Password</div>

        <form action="" onSubmit={handleSubmit(dataSubmit)} className="mt-4 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <FiLock size={20} />
              <input type='password' {...register('password', { required: "Password Is Required", minLength: { value: 8, message: "The password length must be atleast 8" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter New Your Password" autoComplete="off" />
            </div>
            {errors?.password && <p className='text-orange-300 text-sm'>{errors?.password?.message}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
              <FiLock size={20} />
              <input type='password' {...register('confirm_password', { required: "Confirm Password Is Required", validate: (val) => { if (watch('password') !== val) return "Your Password Donot Match" } })} className=" flex-1 bg-transparent outline-none " placeholder="Confirm Your Password" autoComplete="off" />
            </div>
            {errors?.confirm_password && <p className='text-orange-300 text-sm'>{errors?.confirm_password?.message}</p>}
          </div>

          <input type="submit" disabled={isSubmitting} value={`${isSubmitting ? "Changing Password..." : "Set New Password"}`} className={`px-4 py-2 rounded-md ${isSubmitting ? 'cursor-not-allowed bg-gray-600' : 'bg-_accent hover:cursor-pointer hover:animate-pulse'}`} />

        </form>
      </div>
    </div>
  )
}

export default ResetPassword
