import { createContext, useState } from "react";

export const FileImportContext = createContext();

export const FileImportContextProvider = ({ children }) => {
  const [filePaths, setFilePaths] = useState([]); // data selectedFiles di importProject.jsx, namun path nya saja (array)
  
  return (
    <FileImportContext.Provider value={{
      filePaths, setFilePaths
    }}>
      {children}
    </FileImportContext.Provider>
  )
}
