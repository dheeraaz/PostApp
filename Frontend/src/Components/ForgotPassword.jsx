import React from 'react'

const ForgotPassword = ({updateToggle}) => {
    return (
        <div>
            <div>ForgotPassword Content</div>
            <button onClick={()=>updateToggle(1)}>Login</button>
        </div>
    )
}

export default ForgotPassword