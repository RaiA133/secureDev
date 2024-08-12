import './App.css';
import FileStructure from './components/FileStructure';
import ImportProject from './components/ImportProject';
import Result from './components/ResultJson';
import { useContext } from 'react';
import { FileImportContext } from './contexts/fileImportContext';

function App() {
  const {isResultVisible} = useContext(FileImportContext)

  return (
    <div className='flex flex-col gap-4' style={{ height: '100vh' }}>
      {!isResultVisible ? (
        // Center ImportProject and FileStructure vertically when Result is not visible
        <div className='flex flex-1 justify-center items-center flex-row gap-4'>
          <ImportProject />
          <FileStructure />
        </div>
      ) : (
        <>
          <div className='flex flex-row gap-4 pt-10'>
            <ImportProject />
            <FileStructure />
          </div>

          {/* Container for Result with overflow and auto scroll */}
          <div className='flex-1 pb-10'>
            <Result />
          </div>
        </>
      )}
    </div>

  );
}

export default App;
