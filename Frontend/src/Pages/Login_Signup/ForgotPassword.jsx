import { MdOutlineMail } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { forgotPassword } from '../../Apis/authApi.js'
import { useState } from "react";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);


    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
        }
    })

    const dataSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await forgotPassword(data);
            if (response.status === 200) {
                toast.success(response?.data?.message);
                setIsEmailSent(true);
            }
        } catch (error) {
            if (error?.response?.data?.name === "Validation Error") {
                toast.error(error?.response?.data?.errors[0]?.message || "Form validation Error")
            } else {
                toast.error(error?.response?.data?.message || error?.message || "Error In Password Reset")
            }
        } finally {
            setIsSubmitting(false)
        }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        <div className="bg-_primary rounded-md pt-8 mx-auto w-[90%] max-w-[400px]">
            {isEmailSent ? (
                <div className="flex flex-col items-center gap-4 mb-4">
                    <div className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-600  text-transparent bg-clip-text">Email Sent</div>

                    <img src="public/gifs/emailSent.gif" alt="" className="max-w-[150px] max-h-[150px]" />
                    <div className=" text-center">
                        <p>An email with password reset link has been sent to your email!!</p>
                    </div>
                </div>
            ) : (
                <div className="px-4">
                    <div className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-600  text-transparent bg-clip-text">Forgot Password</div>
                    <p className="text-center font-extralight my-4">Enter your email address and we'll send an email to reset your password</p>

                    <form action="" onSubmit={handleSubmit(dataSubmit)} className="flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
                                <MdOutlineMail size={20} /> <input type="email" {...register('email', { required: "Email Address Is Required", pattern: { value: emailRegex, message: "Invalid email address" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Email Address" autoComplete="off" />
                            </div>
                            {errors?.email && <p className='text-orange-300 text-sm'>{errors?.email?.message}</p>}
                        </div>

                        <input type="submit" disabled={isSubmitting} value={`${isSubmitting ? "Sending Link..." : "Send Reset Link"}`} className={`px-4 py-2 rounded-md ${isSubmitting ? 'cursor-not-allowed bg-gray-600' : 'bg-_accent hover:cursor-pointer hover:animate-pulse'}`} />

                    </form>
                </div>
            )}
            <div className="bg-gray-800 rounded-b-md mt-8 flex items-center justify-center gap-2 p-4 font-light">
                <IoIosArrowRoundBack size={25} />
                <button onClick={() => navigate('/')} className=' hover:cursor-pointer text-blue-600 hover:underline font-normal'>Back To Login</button>
            </div>
        </div>
    )
}

export default ForgotPassword