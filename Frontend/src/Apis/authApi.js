import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true, //To include cookies in requests
    timeout: 10000, //timeout 10s
})

export const registerUser = async (frontendData)=>{
    return authApi.post("/auth/register", frontendData);
}

export const loginUser = async (frontendData)=>{
    return authApi.post("/auth/login", frontendData)
} 

export const verifyEmail = async (frontendData)=>{
    return authApi.post("/auth/verifyemail", frontendData)
}

export const forgotPassword = async(frontendData)=>{
    return authApi.post("/auth/forgotpassword", frontendData);
}

export const resetPassword = async(frontendData)=>{
    return authApi.post("/auth/resetpassword", frontendData);
}

export const isUserLoggedIn = async()=>{
    return authApi.get("/users/isuserloggedin");
}