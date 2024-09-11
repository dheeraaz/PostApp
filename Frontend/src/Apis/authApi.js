import axios from 'axios'

const authApi = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true, //To include cookies in requests
})

export const registerUser = async (frontendData)=>{
    return authApi.post("/users/register", frontendData);
}

export const loginUser = async (frontendData)=>{
    return authApi.post("/users/login", frontendData)
}