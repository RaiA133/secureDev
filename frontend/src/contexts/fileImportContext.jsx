import { createContext, useEffect, useState } from "react";

// Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const FileImportContext = createContext();

export const FileImportContextProvider = ({ children }) => {
  const [filePaths, setFilePaths] = useState([]); // data selectedFiles di importProject.jsx, namun path nya saja (array)
  const [filePathsAiSuggest, setFilePathsAiSuggest] = useState([]); // data file mana saya yang di check di awal, di suggest oleh Gemini API

  useEffect(() => {
    if (filePaths.length > 0) {
      const generateContent = async () => {
        try {
          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" } // Set the `responseMimeType` to output JSON
          });
          const prompt = `${filePaths} \n\n THIS IS AN ARRAY OF MY PROJECT STRUCTURE FILES, DEFINE WHAT FRAMEWORK IF ITS USE FRAMEWORK AND GIVE ME THIS ARRAY BACK IN COMPLETE BUT ONLY THE ONE THAT HAS THE FILES THAT ARE USUALLY CHANGED BY THE DEVELOPER, SOME FILES ARE CHANGED FREQUENTLY, AND DON'T GIVE ME TOO MANY !
          
          THE OUTPUT : 
          {
            project : <the framework that use in the project with the version. if its not a framework return 'Personal Project'>
            filePathsAiSuggest : [...ALL ARRAY FILE PATH]
          }
          `;
          const resultGenAI = await model.generateContent(prompt);
          const responseGenAI = resultGenAI.response;
          const textGenAI = responseGenAI.text();
          const JSONtextGenAI = JSON.parse(textGenAI)
          setFilePathsAiSuggest(JSONtextGenAI.filePathsAiSuggest);
        } catch (error) {
          console.error("Error generating content:", error);
        }
      };
      generateContent();
    }
  }, [filePaths]);

  return (
    <FileImportContext.Provider value={{
      filePaths, setFilePaths, 
      filePathsAiSuggest, setFilePathsAiSuggest
    }}>
      {children}
    </FileImportContext.Provider>
  )
}
