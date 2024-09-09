
const Login = ({updateToggle}) => {
  return (
    <div>
      <div>Login Content</div>
      <button onClick={()=>{updateToggle(2)}} className=' hover:cursor-pointer'>Register</button>
      <br />
      <button onClick={()=>{updateToggle(3)}}>Forgot Password</button>
    </div>
  )
}

export default Login