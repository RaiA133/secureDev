import { createContext, useContext, useEffect, useState } from "react";

// Gemini API
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { FileImportContext } from "./fileImportContext";

export const GenerateCodeChanges = createContext();

export const GenerateCodeChangesProvider = ({ children }) => {
  const {projectFramework} = useContext(FileImportContext);
  const {apiKey} = useContext(FileImportContext)

  const [preDataGenCodeChanges, setPreDataGenCodeChanges] = useState([]); // data preparation for Generate Project Code Changes from import
  const [datasetFiltered, setDataSetFiltered] = useState([]) // data dataset dari semua proses baca file yang di filter berdasarkan card di ResultJson.jsx
  const [isLoadingCodeChanges, setIsLoadingCodeChanges] = useState(false); // loading handler
  const [resultCodeChange, setResultCodeChange] = useState(""); // hasil perubahan code kita

  const genAI = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    if (datasetFiltered?.length > 0) {
      const generateContent = async () => {
        try {
          
          setIsLoadingCodeChanges(true);

          const safetySettings = [
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ];

          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings,
          });

          const prompt = `
          ${JSON.stringify(datasetFiltered)} \n\n\n above is the code from my ${JSON.stringify(projectFramework)} application. Give me the code changes in all of these files based on the analysis data below: \n\n
          ${JSON.stringify(preDataGenCodeChanges)}

          \n\n

          output format: 
          1. <filePath> : 
            \`\`\`bash
            <codeChanges>
            \`\`\`

          2. other <filePath> and other codeChanges
            \`\`\`bash
            <other codeChanges>
            \`\`\`

          ...

          codeChanges should not be returned in JSON form, but returned in markdown form, the codeChanges is must be code that change or updated from code above
          and do not use patch or diff format in codeChanges.
          `;

          const resultGenAI = await model.generateContent(prompt);
          const responseGenAI = resultGenAI.response;
          const textGenAI = await responseGenAI.text();
          const JSONtextGenAI = textGenAI;
    
          setResultCodeChange(prevState => ({
            ...prevState, 
            [preDataGenCodeChanges.vulnerability]: JSONtextGenAI 
          }));

          setIsLoadingCodeChanges(false);

        } catch (error) {
          console.error("Error generating content:", error);
        }
      };
      generateContent();
    }
  }, [datasetFiltered]);
  
  return (
    <GenerateCodeChanges.Provider value={{
      preDataGenCodeChanges, setPreDataGenCodeChanges,
      datasetFiltered, setDataSetFiltered,
      isLoadingCodeChanges, setIsLoadingCodeChanges,
      resultCodeChange, setResultCodeChange,
    }}>
      {children}
    </GenerateCodeChanges.Provider>
  )
}
