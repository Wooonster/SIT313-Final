import React, { useState, createContext } from "react";

export const SearchContext = createContext()

export const SearchProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState(null)
    const value = {searchTerm, setSearchTerm}

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}