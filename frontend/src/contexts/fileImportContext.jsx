import { createContext, useEffect, useState } from "react";

// Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const FileImportContext = createContext();

export const FileImportContextProvider = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState([]); // hasil import input form, berupa file dengan type, ukuran, name, dll
  const [filePaths, setFilePaths] = useState([]); // data selectedFiles di importProject.jsx, namun path nya saja (array)
  const [filePathsAiSuggest, setFilePathsAiSuggest] = useState([]); // data file mana saya yang di check di awal, di suggest oleh Gemini API
  const [projectFramework, setProjectFramework] = useState(''); // store data nama framework jika menggunakan framework
  const [checkedPaths, setCheckedPaths] = useState([]); // array dari hasil akhir file mana saja yang di checked
  const [isResultVisible, setIsResultVisible] = useState(false); // kondisi dmn result component akan muncul ketika ini true

  useEffect(() => {
    if (filePaths.length > 0) {
      const generateContent = async () => {
        try {
          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
          });
  
          const prompt = `${filePaths} \n\n THIS IS AN ARRAY OF MY PROJECT STRUCTURE FILES, DEFINE WHAT FRAMEWORK IF ITS USE FRAMEWORK AND GIVE ME THIS ARRAY BACK IN COMPLETE BUT ONLY THE ONE THAT HAS THE FILES THAT ARE USUALLY CHANGED BY THE DEVELOPER, SOME FILES ARE CHANGED FREQUENTLY, AND DON'T GIVE ME TOO MANY!
          
          THE OUTPUT : 
          {
            project : <the framework that use in the project with the version. if its not a framework return 'Personal Project'>
            filePathsAiSuggest : [...ALL ARRAY FILE PATH]
          }

          TRY TO NOT SUGGEST MORE THAN 15 FILE
          `;
  
          const resultGenAI = await model.generateContent(prompt);
          const responseGenAI = resultGenAI.response;
          const textGenAI = await responseGenAI.text();
          const JSONtextGenAI = JSON.parse(textGenAI);
  
          // Update the state using prevState
          setFilePathsAiSuggest(prevState => {
            return JSONtextGenAI?.filePathsAiSuggest || prevState;
          });
  
          setProjectFramework(prevState => {
            return JSONtextGenAI?.project || prevState;
          });
  
        } catch (error) {
          console.error("Error generating content:", error);
        }
      };
      generateContent();
    }
  }, [filePaths]);
  

  return (
    <FileImportContext.Provider value={{
      selectedFiles, setSelectedFiles,
      filePaths, setFilePaths, 
      filePathsAiSuggest, setFilePathsAiSuggest,
      projectFramework, setProjectFramework,
      checkedPaths, setCheckedPaths,
      isResultVisible, setIsResultVisible,
    }}>
      {children}
    </FileImportContext.Provider>
  )
}
