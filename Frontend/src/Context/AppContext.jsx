import { createContext, useContext, useEffect, useState } from "react";
import { isUserLoggedIn } from "../Apis/appApi.js";
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        ; (async () => {
            try {
                const response = await isUserLoggedIn();
                if(response?.status===200){
                    setIsLoggedIn(true);
                    setUserDetails(response.data.data);
                }else{
                    setIsLoggedIn(false);
                    setUserDetails({});
                }
            } catch (error) {
                if(error?.response && error?.response?.status === 401){
                    if(error?.response?.data?.name ==="SessionExpired"){
                        toast.error(error?.response?.data?.message);
                    }
                    console.log("Unauthorized Userr");
                }else{
                    console.log("Error in AppContext", error);
                }
            }finally{
                setIsAppLoading(false);
            }
        })()
    },[])

    return <AppContext.Provider value={{ userDetails, setUserDetails, isLoggedIn, setIsLoggedIn, isAppLoading }}>
        {children}
    </AppContext.Provider>
}

export const useGlobalAppContext = () => {
    return useContext(AppContext);
}