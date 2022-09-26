import React, { createContext, useState} from "react";

export const PictuerContext = createContext()

export const PictureProvider = ({children}) => {
    const [newPicture, setNewPicture] = useState(null)
    const value = {newPicture, setNewPicture}

    return <PictuerContext.Provider value={value}>{children}</PictuerContext.Provider>
}