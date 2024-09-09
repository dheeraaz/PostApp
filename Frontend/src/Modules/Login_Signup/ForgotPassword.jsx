import { MdOutlineMail } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ updateToggle }) => {
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
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
                <div className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-600  text-transparent bg-clip-text">Forgot Password</div>
                <p className="text-center font-extralight my-4">Enter your email address and we'll send an email to reset your password</p>

                <form action="" onSubmit={handleSubmit(dataSubmit)} className="flex flex-col gap-4">
                    <div>
                        <div className="flex items-center gap-2 bg-gray-600 w-full p-2 rounded-md group border-[1px] border-transparent focus-within:border-blue-500">
                            <MdOutlineMail size={20} /> <input type="email" {...register('email', { required: "Email Address Is Required", pattern: { value: emailRegex, message: "Invalid email address" } })} className=" flex-1 bg-transparent outline-none " placeholder="Enter Your Email Address" autoComplete="off" />
                        </div>
                        {errors?.email && <p className='text-orange-300 text-sm'>{errors?.email?.message}</p>}
                    </div>
                    <input type="submit" value="Send Reset Link" className="bg-_accent px-4 py-2 rounded-md hover:cursor-pointer hover:animate-pulse" />
                </form>
            </div>
            <div className="bg-gray-800 rounded-b-md mt-8 flex items-center justify-center gap-2 p-4 font-light">
                <IoIosArrowRoundBack size={25} />
                <button onClick={() => navigate('/')} className=' hover:cursor-pointer text-blue-600 hover:underline font-normal'>Back To Login</button>
            </div>
        </div>
    )
}

export default ForgotPassword