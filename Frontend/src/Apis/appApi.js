import axios from "axios";

const appApi = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, //To include cookies in requests
    timeout: 10000, //timeout 10s
})

appApi.interceptors.response.use(function (response) {
    // any response within the range of 2xx is simply returned with no additional actions
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    // saving original request for retrying
    let originalRequest = error.config;

    // status code === 401eror, indicates access token expiry and refreshing token only if access token is expired
    if (error.response.status === 401 && error.response.data.name === "AccessTokenExpired") {
        try {
            // hitting refreshtoken end point for refreshing tokens 
            await appApi.post('v1/users/refreshtokens', {});
            console.log("Session Refreshed");

            // used while sending locally stored cookie to backend
            // const response = await appApi.post('/users/refreshtokens', {});
            // const newAccessToken = refreshResponse.data.accesstoken;

            // // Update the access token for the original request
            // appApi.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            return appApi(originalRequest); // Retry original request with new token
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export const isUserLoggedIn = async () => {
    return appApi.get("v1/users/isuserloggedin");
}

export const logOut = async () => {
    return appApi.post("v1/users/logout", {});
}

export const uploadProfilePic = async (frontendData)=>{
    return appApi.patch('v1/users/updateprofilepic', frontendData, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    })
}

export const uploadCoverPic = async (frontendData)=>{
    return appApi.patch('v1/users/updatecoverpic', frontendData, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
    })
}

export const createPost = async(frontendData)=>{
    return appApi.post('/v1/posts/createpost', frontendData, {
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
}

export const getAllPosts = async()=>{
    return appApi.get('/v1/posts/getallposts')
}