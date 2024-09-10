import React from 'react'
import {Outlet} from 'react-router-dom'

const AppLayout = () => {
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