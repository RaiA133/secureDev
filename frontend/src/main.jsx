import React from 'react'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from "@nextui-org/react";
import App from './App.jsx'
import { FileImportContextProvider } from './contexts/fileImportContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background h-screen flex justify-center items-center">
        <FileImportContextProvider>
          <App />
        </FileImportContextProvider>
      </main>
    </NextUIProvider>
  </React.StrictMode>,
)
