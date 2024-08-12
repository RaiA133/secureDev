import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from "@nextui-org/react";
import App from './App.jsx'
import { FileImportContextProvider } from './contexts/fileImportContext.jsx';
import { ResultContextProvider } from './contexts/resultContextJson.jsx';
import { GenerateCodeChangesProvider } from './contexts/generateCodeChanges.jsx';
import './main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background h-screen overflow-y-auto flex justify-center items-center">
      <div className="background-oval"></div>
        <FileImportContextProvider>
          <ResultContextProvider>
            <GenerateCodeChangesProvider>
              <App />
            </GenerateCodeChangesProvider>
          </ResultContextProvider>
        </FileImportContextProvider>
      </main>
    </NextUIProvider>
  </React.StrictMode>,
)
