import React, { createContext, useState } from "react";

export const MarkdownContext = createContext()

export const MarkdownProvider = ({children}) => {
    const [mdContext, setMdContext] = useState(null)
    const value = {mdContext, setMdContext}

    return <MarkdownContext.Provider value={value}>{children}</MarkdownContext.Provider>
}