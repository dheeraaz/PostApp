import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Authentication } from './Pages/index.js'

const myRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Authentication />} />
  )
)

const App = () => {
  return <div className='_app_container'>
    <RouterProvider router={myRouter} />
  </div>
}

export default App