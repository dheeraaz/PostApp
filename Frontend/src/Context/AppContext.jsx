import { createContext, useContext, useEffect, useState } from "react";
import { getAllPosts, isUserLoggedIn } from "../Apis/appApi.js";
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);

    const [allPosts, setAllPosts] = useState([]);

    const getAllPostsFunction = async () => {
        try {
            const response = await getAllPosts();
            if (response?.status === 200) {
                setAllPosts(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || error?.message || "Internal Server Error")
        }
    }

    useEffect(() => {
        ; (async () => {
            try {
                const response = await isUserLoggedIn();
                if (response?.status === 200) {
                    setIsLoggedIn(true);
                    setUserDetails(response.data.data);
                } else {
                    setIsLoggedIn(false);
                    setUserDetails({});
                }
            } catch (error) {
                if (error?.response && error?.response?.status === 401) {
                    if (error?.response?.data?.name === "SessionExpired") {
                        toast.error(error?.response?.data?.message);
                    }
                    console.log("Unauthorized Userr");
                } else {
                    console.log("Error in AppContext", error);
                }
            } finally {
                setIsAppLoading(false);
            }
        })()
    }, [])

    return <AppContext.Provider value={{ userDetails, setUserDetails, isLoggedIn, setIsLoggedIn, isAppLoading, allPosts, setAllPosts, getAllPostsFunction }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalAppContext = () => {
    return useContext(AppContext);
}