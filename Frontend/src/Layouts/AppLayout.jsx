import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useGlobalAppContext } from '../Context/AppContext'
import AppHeader from '../Components/Headers/AppHeader.jsx'

const AppLayout = () => {

  const { isLoggedIn, isAppLoading } = useGlobalAppContext();

  if (isAppLoading) return <div>Loading...</div>;

  if (!isLoggedIn) return <Navigate to='/' />;

  return (
    <main className='min-h-screen flex flex-col'>
      <header className='mb-2 sticky top-0 left-0 right-0 z-10'>
        <AppHeader />
      </header>
      {/* <section className="w-full flex-grow border-2 border-red-500"> */}
      <section className="w-full flex-grow">
        <Outlet />
      </section>
    </main >
  )
}


export default AppLayout