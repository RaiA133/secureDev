import { createContext, useEffect, useState } from "react";

// Gemini API
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const ResultContext = createContext();

export const ResultContextProvider = ({ children }) => {
  const [dataset, setDataset] = useState([]); // data object berupa bahan untuk sebelum ditanyakan ke Gemini API
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(""); // data hasil generate AI

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
            generationConfig: { responseMimeType: "application/json" },
            safetySettings,
          });

          console.log(dataset.code);

          const prompt = `${JSON.stringify(dataset.code)} \n\n It's a ${dataset.framework} app. Look for vulnerabilities from the data above! If necessary, give me a description, and how to overcome the vulnerability if there is one. Then also provide all the code changes in each file whose code is stated to have to be changed!

          Format output:
          {
              "<vulnerability_name>": {
                  "descriptions": "<description>",
                  "levelThereat" : "<info(Issues that do not have a direct security impact but may provide useful information) / low / medium / high / critical/>"
                  "typeThereat" : "<could be like data security / authentication security / etc. just write down what security is>"
                  "filePath": ["<array of filePath from data above>"],
                  "solution": "<brief explanation of the solution>",
                  "attention": ["<an array in the form of points that must be paid attention to, and important notes for code and other attention and descriptions>"],
              },
              ... other vulnerability (try more than 1 vulnerability)
          }

          make sure the data can be in JSON.parse
          `;

          // "codeChanges" : {
          //   "filePath" : '<codeChanges>',
          //   ... "<other file path>" : '<other file codeChanges>'      
          // },


          const resultGenAI = await model.generateContent(prompt);
          const responseGenAI = resultGenAI.response;

          const textGenAI = await responseGenAI.text();
          // console.log("sebelum parse", textGenAI);

          // const JSONtextGenAI = textGenAI;

          const JSONtextGenAI = JSON.parse(textGenAI);
          // console.log("setelah parse", JSONtextGenAI);

          // return

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
