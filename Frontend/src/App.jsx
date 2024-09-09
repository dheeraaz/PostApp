import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './Layouts/AuthLayout.jsx'
import { Login, Registration, ForgotPassword, ResetPassword, } from './Modules/Login_Signup/index.js'
import Error from './Modules/Error/Error.jsx'

const myRouter = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path='/' element={<AuthLayout />}>
      <Route path='' element={<Login />} />
      <Route path='/registration' element={<Registration />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/resetpassword' element={<ResetPassword />} />
    </Route>
    <Route path='*' element={<Error />} />
  </>
  )
)

const App = () => {
  return <div className='_app-container'>
    <RouterProvider router={myRouter} />
  </div>
}

export default App