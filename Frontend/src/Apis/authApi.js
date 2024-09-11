import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true, //To include cookies in requests
    timeout: 10000, //timeout 10s
})

export const registerUser = async (frontendData)=>{
    return authApi.post("/users/register", frontendData);
}

export const loginUser = async (frontendData)=>{
    return authApi.post("/users/login", frontendData)
} 

export const verifyEmail = async (frontendData)=>{
    return authApi.post("/users/verifyemail", frontendData)
}