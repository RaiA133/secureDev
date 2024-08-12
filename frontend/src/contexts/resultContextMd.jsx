import { createContext, useContext, useEffect, useState } from "react";

// Gemini API
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { FileImportContext } from "./fileImportContext";

export const ResultContext = createContext();

export const ResultContextProvider = ({ children }) => {
  const {apiKey} = useContext(FileImportContext)

  const [dataset, setDataset] = useState([]); // data object berupa bahan untuk sebelum ditanyakan ke Gemini API
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(""); // data hasil generate AI

  const genAI = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    if (dataset?.code?.length > 0) {
      const generateContent = async () => {
        try {
          
          setIsLoading(true);

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

          const prompt = `${JSON.stringify(dataset.code)} \n\n It's a ${dataset.framework} app. Look for vulnerabilities from the data above! If necessary, give me a description, and how to overcome the vulnerability if there is one. Then also provide all the code changes in each file whose code is stated to have to be changed!

          Format output
          1. <vulnerability_name>
            <description>

            File Path : <data of filePath from data above>
            Solution : <brief explanation of the solution>
            Attention : <a list in form of points that must be paid attention to, and important notes for code and other attention and descriptions>

            - <filePath> : 
              <codeChanges>
            ... other <filePath> and other codeChanges

          ... other vulnerability
          // `;


          const resultGenAI = await model.generateContent(prompt);
          const responseGenAI = resultGenAI.response;
          const textGenAI = await responseGenAI.text();
          const JSONtextGenAI = textGenAI;
    
          setResult(prevState => {
            return JSONtextGenAI || prevState;
          });

          setIsLoading(false);

        } catch (error) {
          console.error("Error generating content:", error);
        }
      };
      generateContent();
    }
  }, [dataset]);

  return (
    <ResultContext.Provider value={{
      dataset, setDataset,
      result,
      isLoading, setIsLoading
    }}>
      {children}
    </ResultContext.Provider>
  );
};
