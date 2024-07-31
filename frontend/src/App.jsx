import './App.css';
import FileStructure from './components/FileStructure';
import ImportProject from './components/ImportProject';

function App() {

  return (
    <div className='flex flex-row gap-4'>

      <ImportProject />

      <FileStructure />

    </div>
  );
}

export default App;
