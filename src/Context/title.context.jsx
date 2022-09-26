import React, { createContext, useState } from "react";

export const TitleContext = createContext ()

export const TitleProvider = ({children}) => {
    const [currentTitle, setCurrentTitle] = useState(null)
    const value = {currentTitle, setCurrentTitle}

    return <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
}