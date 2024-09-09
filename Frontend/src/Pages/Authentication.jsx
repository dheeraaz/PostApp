import { useState } from "react"
import Login from "../Components/Login.jsx";
import Registration from "../Components/Registration.jsx";
import ForgotPassword from "../Components/ForgotPassword.jsx";


const Authentication = () => {
  // lifting the state up
  // toggle === 1 => Login, toggle === 2 => Register, toggle === 3, Forgot Password
  const [toggle, setToggle] = useState(1);
  const updateToggle = (id) => {
    setToggle(id);
  }
  return (
    <div className="w-fit mx-auto min-h-screen flex items-center">
      <div className="bg-[#111727]">
        {toggle === 1 && <Login updateToggle={updateToggle} />}
        {toggle === 2 && <Registration updateToggle={updateToggle} />}
        {toggle === 3 && <ForgotPassword updateToggle={updateToggle} />}
      </div>
    </div>
  )
}

export default Authentication