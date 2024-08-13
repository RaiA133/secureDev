import './App.css';
import Result from './components/ResultJson';
import InputApiKey from './components/InputApiKey';
import FileStructure from './components/FileStructure';
import ImportProject from './components/ImportProject';
import { useContext } from 'react';
import { FileImportContext } from './contexts/fileImportContext';

function App() {
  const { isResultVisible } = useContext(FileImportContext)

  return (
    <div className='flex flex-col gap-4' style={{ height: '100vh' }}>

      <InputApiKey />

      {!isResultVisible ? (
        // Center ImportProject and FileStructure vertically when Result is not visible
        <div className='flex flex-1 justify-center items-center md:flex-row flex-col gap-4 mx-5'>
          <ImportProject />
          <FileStructure />
        </div>
      ) : (
        <div className='flex flex-col gap-4 min-w-[300px] max-w-[850px] mx-5'>
          <div className='flex md:flex-row flex-col gap-4 pt-10'>
            <div className='flex-1'>
              <ImportProject />
            </div>
            <div className='flex-1'>
              <FileStructure />
            </div>
          </div>

          {/* Container for Result with overflow and auto scroll */}
          <div className='flex-1 pb-10'>
            <Result />
          </div>
        </div>

      )}
    </div>

  );
}

export default App;
