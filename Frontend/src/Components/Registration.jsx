
const Registration = ({updateToggle}) => {
    return (
      <div>
        <div>Registration Content</div>
        <button onClick={()=>{updateToggle(1)}} className='text-red-900 hover:cursor-pointer'>Login</button>
      </div>
    )
  }

  export default Registration;