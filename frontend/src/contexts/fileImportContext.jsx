import { createContext, useState } from "react";

export const FileImportContext = createContext();

export const FileImportContextProvider = ({ children }) => {
  const [filePaths, setFilePaths] = useState([]);
  return (
    <FileImportContext.Provider value={{
      filePaths, setFilePaths
    }}>
      {children}
    </FileImportContext.Provider>
  )
}
