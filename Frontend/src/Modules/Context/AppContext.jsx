import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()

    return <AppContext.Provider value={{firstName, lastName}}>
    {children}
    </AppContext.Provider>
}

export const useGlobalAppContext = ()=>{
    return useContext(AppContext);
}