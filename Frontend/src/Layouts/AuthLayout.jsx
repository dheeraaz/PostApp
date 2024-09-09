import React from 'react'
import { Outlet } from 'react-router-dom'


const AuthLayout = () => {
  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <Outlet />
    </main>
  )
}

export default AuthLayout