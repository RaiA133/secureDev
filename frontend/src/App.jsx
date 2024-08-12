import './App.css';
import FileStructure from './components/FileStructure';
import ImportProject from './components/ImportProject';
import Result from './components/ResultJson';

function App() {

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row gap-4'>
        <ImportProject />
        <FileStructure />
      </div>
      <Result />
    </div>
  );
}

export default App;
