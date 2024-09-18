import { createContext, useContext, useEffect, useState } from "react";
import { isUserLoggedIn } from "../Apis/authApi.js";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [isAppLoading, setIsAppLoading] = useState(true);
    const [isAppLoading, setIsAppLoading] = useState(false);


    useEffect(() => {
        ; (async () => {
            try {
                const response = await isUserLoggedIn();
                console.log("from appcontext===>", response)
                if(response?.status===200){
                    setIsLoggedIn(true);
                }else{
                    setIsLoggedIn(false);
                }
            } catch (error) {
                if(error?.response && error?.response?.status ===401){
                    console.log("Unauthorized User");
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