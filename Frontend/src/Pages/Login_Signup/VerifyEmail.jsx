import React, { useEffect, useRef, useState } from 'react'
import { verifyEmail } from '../../Apis/authApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGlobalAppContext } from '../../Context/AppContext';

const VerifyEmail = ({ otpLength = 6 }) => {
    const [otpFields, setOtpFields] = useState(new Array(otpLength).fill(""))
    const [showVerifyButton, setShowVerifyButton] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const ref = useRef([]);
    const {setIsLoggedIn} = useGlobalAppContext();
    const navigate = useNavigate();

    const handleKeyDown = (e, index) => {
        const key = e.key;
        if (isNaN(key)) {
            if (key === 'Backspace') {
                const copyOtpFields = [...otpFields];
                copyOtpFields[index] = "";
                if (index - 1 > -1) {
                    ref.current[index - 1].focus();
                }
                setOtpFields(copyOtpFields)
            }
            if (key === 'ArrowLeft') {
                if (index - 1 > -1) {
                    ref.current[index - 1].focus();
                }
            }
            if (key === 'ArrowRight') {
                if (index + 1 < otpFields.length) {
                    ref.current[index + 1].focus();
                }
            }
            // return null for all keys except backspace, arrowleft, arrowright
            return;
        }

        const copyOtpFields = [...otpFields];
        copyOtpFields[index] = key;
        if (index + 1 < otpFields.length) {
            ref.current[index + 1].focus();
        }
        setOtpFields(copyOtpFields)
    }

    const handleChange = () => {
        // just to avoid the console error shown for not using onChange method in react form
        return;

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(otpFields)
        try {
            setIsSubmitting(true);
            // sending otpFields to backend as: {otpFields: ['1','2','3','4','9','0']}
            const response = await verifyEmail({ otpFields: otpFields });
            if (response.status === 200) {
                toast.success(response?.data?.message);
                setIsLoggedIn(true);
                navigate('/home')
            }
        } catch (error) {
            if (error?.response?.data?.name === "Validation Error") {
                toast.error(error?.response?.data?.errors[0]?.message || "Form validation Error")
            } else {
                toast.error(error?.response?.data?.message || error?.message || "Error In Verfifying Email")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        // when the component is first loaded, set the focus in first otp fields
        ref.current[0].focus();
    }, [])

    useEffect(() => {
        // this sets isAllOtpFieldNumber if all the fields are Number
        const isAllOtpFieldNumber = otpFields.every((value) => /^\d+$/.test(value))
        setShowVerifyButton(isAllOtpFieldNumber);
    }, [otpFields])

    return (
        <div className="bg-_primary rounded-md py-8 mx-auto w-[90%] max-w-[400px]">
            <div className="px-4">
                <div className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-purple-600  text-transparent bg-clip-text">Verify Email</div>
                <p className="text-center font-extralight my-4">Enter the {otpLength}-digit code sent to your email address to verify you.</p>

                <form className='my-6 flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='flex flex-row gap-2'>
                        {otpFields.map((value, index) => {
                            return <input
                                key={index}
                                type="text"
                                ref={(currentInput) => ref.current[index] = currentInput}
                                value={value}
                                onChange={handleChange}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                // className='text-center rounded-md w-1/6 h-12 bg-gray-600 outline-none border-[1px] border-transparent focus:border-blue-500'
                                className={`text-center rounded-md ${otpLength === 4 && 'w-1/4'} ${otpLength === 6 && 'w-1/6'} h-12 bg-gray-600 outline-none border-[1px] border-transparent focus:border-blue-500`}
                            />
                        })}
                    </div>
                    {showVerifyButton && <input type="submit" disabled={isSubmitting} value={`${isSubmitting ? "Verifying..." : "Verify Email"}`} className={`px-4 py-2 rounded-md ${isSubmitting ? 'cursor-not-allowed bg-gray-600' : 'bg-_accent hover:cursor-pointer hover:animate-pulse'}`} />}
                </form>
            </div>
        </div>
    )
}

export default VerifyEmail