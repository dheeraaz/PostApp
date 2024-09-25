import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useGlobalAppContext } from '../Context/AppContext'
import AuthHeader from '../Components/Headers/AuthHeader'

const AuthLayout = () => {
  const { isLoggedIn, isAppLoading } = useGlobalAppContext();

  if(isAppLoading) return <div>Loading...</div>;

  if (isLoggedIn) return <Navigate to='/home'/>

  return (
    <main className='min-h-screen flex flex-col'>
      <AuthHeader />
      <section className="w-full flex-grow flex items-center justify-center">
        <Outlet />
      </section>
    </main>
  )
}

export default AuthLayout