import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useGlobalAppContext } from '../Context/AppContext'

const AppLayout = () => {

  const {isLoggedIn, isAppLoading} = useGlobalAppContext();
 
  if(isAppLoading) return <div>Loading...</div>;

  // if(!isLoggedIn) return <Navigate to='/'/>;

  return (
    <>
      <header>
        <nav>This is navbar</nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout