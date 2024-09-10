import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import AuthLayout from './Layouts/AuthLayout.jsx'
import { Login, Registration, ForgotPassword, ResetPassword, VerifyEmail} from './Pages/Login_Signup/index.js'

import AppLayout from './Layouts/AppLayout.jsx'
import Home from './Pages/Home/Home.jsx'

import Error from './Pages/Error/Error.jsx'

const myRouter = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path='/' element={<AuthLayout />}>
      <Route path='' element={<Login />} />
      <Route path='/registration' element={<Registration />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path='/resetpassword' element={<ResetPassword />} />
      <Route path='/verifyemail' element={<VerifyEmail />} />
    </Route>
    <Route path='/home' element={<AppLayout/>}>
    <Route path='' element={<Home />}/>
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