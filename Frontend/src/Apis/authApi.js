import axios from 'axios'

const authApi = axios.create({
    // baseURL: 'http://localhost:3000/api',
    baseURL: 'https://postapp-backend-7g5a.onrender.com/api',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true, //To include cookies in requests
    timeout: 20000, //timeout 20s
})

export const registerUser = async (frontendData)=>{
    return authApi.post("/v1/users/register", frontendData);
}

export const loginUser = async (frontendData)=>{
    return authApi.post("/v1/users/login", frontendData)
} 

export const verifyEmail = async (frontendData)=>{
    return authApi.post("/v1/users/verifyemail", frontendData)
}

export const forgotPassword = async(frontendData)=>{
    return authApi.post("/v1/users/forgotpassword", frontendData);
}

export const resetPassword = async(frontendData)=>{
    return authApi.post("/v1/users/resetpassword", frontendData);
}

export const isUserLoggedIn = async()=>{
    return authApi.get("/v1/users/isuserloggedin");
}
