import React from 'react'
import { Link } from 'react-router-dom'

const AuthHeader = () => {
    return (
        <nav className='p-6'>
            <div className='max-w-[130px] h-full'>
                <Link to='/'>
                    <img src="/images/LogoPostApp.png" alt="logo_postApp" className='w-full h-full' />
                </Link>
            </div>
        </nav>
    )
}

export default AuthHeader