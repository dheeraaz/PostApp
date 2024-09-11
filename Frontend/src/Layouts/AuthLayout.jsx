import React from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'


const AuthLayout = () => {
  return (
    <main className='min-h-screen flex flex-col'>
      <nav className='p-6'>
        <div className='max-w-[130px] h-full'>
          <Link to='/'>
            <img src="/images/LogoPostApp.png" alt="logo_postApp" className='w-full h-full' />
          </Link>
        </div>
      </nav>
      <section className="w-full flex-grow flex items-center justify-center">
        <Outlet />
      </section>
    </main>
  )
}

export default AuthLayout